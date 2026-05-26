import { Button } from '../ui/Button';

export function TeacherProfileForm() {
  return (
    <form className="grid gap-3 md:grid-cols-2">
      <input placeholder="Bio" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Courses taught" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Levels taught" className="rounded-md bg-taxo-dark p-3" />
      <input placeholder="Age groups accepted" className="rounded-md bg-taxo-dark p-3" />
      <input type="file" accept="image/*" className="rounded-md bg-taxo-dark p-3" />
      <input type="file" accept="video/*" className="rounded-md bg-taxo-dark p-3" />
      <Button className="md:col-span-2" type="button">Send for admin approval</Button>
    </form>
  );
}
