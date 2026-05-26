export function FlowStepper({ steps }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => (
        <div key={step} className="glass rounded-lg p-4">
          <div className="mb-2 grid h-8 w-8 place-items-center rounded-full bg-taxo-gold text-sm font-black text-taxo-dark">{index + 1}</div>
          <p className="text-sm font-semibold text-taxo-light">{step}</p>
        </div>
      ))}
    </div>
  );
}
