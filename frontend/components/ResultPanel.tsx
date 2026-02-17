interface ResultPanelProps {
    result: {
        evaluation: {
            totalScore: number;
            feedback: string;
        };
    };
}

export default function ResultPanel({ result }: ResultPanelProps) {
    return (
        <div>
            <h3>Total Score: {result.evaluation.totalScore}</h3>
            <p>{result.evaluation.feedback}</p>
        </div>
    );
}