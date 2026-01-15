export default function Button({ children }: { children: React.ReactNode }) {
    return (
        <button className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition-opacity">
            {children}
        </button>
    );
}
