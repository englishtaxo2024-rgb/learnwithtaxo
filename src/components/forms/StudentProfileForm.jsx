import { Button } from '../ui/Button';

export function StudentProfileForm() {
  return (
    <form className="grid gap-3 md:grid-cols-2">
      <input placeholder="Student name" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Parent email" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Phone" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Age" className="rounded-md bg-taxo-dark p-3" />
      <Button className="md:col-span-2" type="button">Save profile</Button>
    </form>
  );
}
