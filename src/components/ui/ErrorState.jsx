export function ErrorState({ title = 'Something needs attention', message }) {
  return <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100"><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm">{message}</p></div>;
}
