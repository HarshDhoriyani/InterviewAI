interface QuestionPanelProps {
    question: {
        title: string;
        description: string;
    } | null;
}

export default function QuestionPanel({ question }: QuestionPanelProps) {
    if (!question) return <p>Loading...</p>;

    return (
        <div>
            <h2>{question.title}</h2>
            <p>{question.description}</p>
        </div>
    );
}