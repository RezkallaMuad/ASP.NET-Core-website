import react, { useEffect, useState } from 'react';

interface Project {
    id: number;
    name: string;
    description: string;
    technologies: string;
    githubUrl: string;
    demoUrl: string;
}

export default function ProjectsList() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        fetch("http://localhost:5038/api/projects")
        .then(res => res.json())
        .then(data => setProjects(data));
    }, []);

    return (
        <div className = "grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{projects.map((p) => (
            <div key={p.id} className="border rounded-lg p-4 shadow">
                <h2 className="text-xl font-bold">{p.name}</h2>
                <p>{p.description}</p>
                <p className="text-sm text-gray-600">{p.technologies}</p>
                <div className = "mt-2 flex gap-2">
                    <a href={p.githubUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">GitHub</a>
                    {p.demoUrl && <a href={p.demoUrl} className="text-green-500" target="_blank" rel="noopener noreferrer">Demo</a>}
                </div>
            </div>
            
        ))}
    </div>
    );
}