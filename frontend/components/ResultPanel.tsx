export default function ResultPanel({ result }: any) {
  const score = Math.round(result.evaluation.totalScore);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800">
        Interview Result
      </h2>

      {/* Score */}
      <div className="mt-6 flex items-center gap-6">
        <div className="text-5xl font-bold text-indigo-600">
          {score}%
        </div>
        <div className="text-slate-600">
          Overall Performance Score
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <ScoreRow label="Correctness" value={result.evaluation.correctnessScore} />
        <ScoreRow label="Efficiency" value={result.evaluation.efficiencyScore} />
        <ScoreRow label="Code Quality" value={result.evaluation.qualityScore} />
        <ScoreRow label="Edge Handling" value={result.evaluation.edgeCaseScore} />
        <ScoreRow label="Explanation" value={result.explanationScore || 0} />
      </div>

      {/* Feedback */}
      <div className="mt-6 bg-slate-50 border rounded-lg p-4 text-slate-600">
        {result.evaluation.feedback}
      </div>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-800">
        {Math.round(value)}%
      </span>
    </div>
  );
}