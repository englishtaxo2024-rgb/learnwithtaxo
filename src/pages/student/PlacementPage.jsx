import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlacementCodeForm } from '../../components/forms/PlacementCodeForm';
import { scorePlacement } from '../../services/placementService';

export function PlacementPage() {
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState(null);
  async function submit(event) {
    event.preventDefault();
    setResult(await scorePlacement(Object.fromEntries(new FormData(event.currentTarget))));
  }
  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-black">Placement Test</h1>
      <Card>
        {!started ? <PlacementCodeForm onStart={() => setStarted(true)} /> : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block font-bold">Do you already know the English alphabet? / هل تعرف حروف اللغة الإنجليزية؟</label>
            <select name="knowsAlphabet" className="w-full rounded-md bg-taxo-dark p-3"><option value="yes">Yes</option><option value="no">No</option></select>
            <textarea name="writing" placeholder="Writing answer" className="w-full rounded-md bg-taxo-dark p-3" />
            <Button>Submit placement</Button>
          </form>
        )}
      </Card>
      {result && <Card><h2 className="text-xl font-bold">Recommended result</h2><p className="mt-2 text-taxo-light">{result.course} - {result.cefr} - {result.level}</p><p className="text-taxo-light">Saved to student profile, parent email queue, and audit log.</p></Card>}
    </div>
  );
}
