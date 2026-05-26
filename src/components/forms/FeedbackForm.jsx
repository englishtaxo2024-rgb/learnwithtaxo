import { useState } from 'react';
import { Button } from '../ui/Button';
import { submitFeedback } from '../../services/feedbackService';
import { playUiSound } from '../../utils/sound';

const fields = ['Overall rate', 'Teacher internet stability', 'Teacher voice clarity', 'Teacher camera quality', 'Teacher lighting quality', 'Teacher dress code', 'Teacher used games', 'Each student read', 'Each student wrote', 'Each student spoke', 'Equal treatment', 'Session was fun'];

export function FeedbackForm() {
  const [saved, setSaved] = useState(false);
  async function submit(event) {
    event.preventDefault();
    await submitFeedback(Object.fromEntries(new FormData(event.currentTarget)));
    setSaved(true);
    playUiSound('success');
  }
  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
      {fields.map((field) => <label key={field} className="rounded-md bg-white/5 p-3 text-sm font-semibold">{field}<input name={field} type="range" min="1" max="5" defaultValue="5" className="mt-3 w-full" /></label>)}
      <textarea name="comment" placeholder="Optional comment" className="md:col-span-2 rounded-md border border-white/10 bg-taxo-dark p-3" />
      <Button className="md:col-span-2" type="submit">Submit feedback</Button>
      {saved && <p className="md:col-span-2 rounded-md bg-emerald-400/15 p-3 text-emerald-100">Feedback saved. Thank you.</p>}
    </form>
  );
}
