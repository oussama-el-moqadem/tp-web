// app/projects/[id]/page.tsx
interface Props {
    params: Promise<{ id: string }>;
}
export default async function ProjectPage({ params }: Props) {
    const { id } = await params;
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Projet {id}</h1>
            <p>Détails du projet (fetch dans la Partie 4)</p>
        </div>
    );
}