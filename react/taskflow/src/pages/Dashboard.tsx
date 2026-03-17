import { useEffect, useState } from 'react';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import styles from './Dashboard.module.css';
import { useAuth } from '../features/auth/AuthContext';

interface Project { id: string; name: string; color: string; }
interface Column { id: string; title: string; tasks: string[]; }

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [p, c] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(p.data);
        setColumns(c.data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  //  POST — ajouter un projet
  async function addProject(name: string, color: string) {
  try {
    const { data } = await api.post('/projects', { name, color });
    setProjects(prev => [...prev, data]);
  } catch (e) {
    alert("Erreur : serveur indisponible");
    console.error(e);
  }
}

  //  PUT — renommer un projet
  async function renameProject(project: Project) {
    const newName = prompt('Nouveau nom :', project.name);
    if (!newName) return; // vide ou cancel
    if (newName.trim() === project.name.trim()) return; // identique

    const { data } = await api.put(`/projects/${project.id}`, { ...project, name: newName.trim() });

    // update state : on remplace uniquement le projet modifié
    setProjects(prev => prev.map(p => (p.id === project.id ? data : p)));
  }

  //  DELETE — supprimer un projet
  async function deleteProject(id: string) {
    const ok = confirm('Êtes-vous sûr ?');
    if (!ok) return;

    await api.delete(`/projects/${id}`);

    // update state : retirer l’élément supprimé
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen(p => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />

      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            <button className={styles.addBtn} onClick={() => setShowForm(true)}>
              + Nouveau projet
            </button>

            {/* Démo simple : rename/delete sur 1er projet */}
            {projects[0] && (
              <>
                <button className={styles.addBtn} onClick={() => renameProject(projects[0])}>
                  Renommer 1er
                </button>
                <button className={styles.addBtn} onClick={() => deleteProject(projects[0].id)}>
                  Supprimer 1er
                </button>
              </>
            )}
          </div>

          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}