export default function AssessmentValidationAlert({ errors }) {
  if (!errors.length) {
    return null;
  }

  return (
    <div className="mt-8 max-w-7xl mx-auto">
      <div className="bg-rose-50 border border-rose-200 rounded-[12px] p-4 mb-4">
        <p className="text-rose-800 text-sm font-medium mb-2">
          Silakan lengkapi field yang wajib diisi:
        </p>

        <ul className="text-rose-700 text-sm space-y-1">
          {errors.map((error) => (
            <li key={error}>- {error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
