import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { DataTable } from '../../components/dashboards/DataTable';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useTranslation } from '../../hooks/useTranslation';
import { platformApi } from '../../services/platformApi';

function rowsFrom(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.rows)) return payload.rows;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.assignments)) return payload.assignments;
  if (Array.isArray(payload?.practice)) return payload.practice;
  return [];
}

function columnsFrom(rows) {
  const hidden = new Set([
    'code_hash',
    'attempt_token_hash',
    'answer_key',
    'teacher_notes',
    'quiz_json',
    'game_json',
    'answers_json',
    'report_json'
  ]);
  const keys = [...new Set(rows.flatMap((row) => Object.keys(row || {})))]
    .filter((key) => !hidden.has(key))
    .slice(0, 7);
  return keys.map((key) => ({
    key,
    label: key.replace(/^_/, '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
  }));
}

export function PlatformDataPage({ title, titleAr, description, descriptionAr, endpoint, emptyText, availabilityForm = false }) {
  const { lang, dir } = useTranslation();
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const rows = useMemo(() => rowsFrom(payload), [payload]);
  const columns = useMemo(() => columnsFrom(rows), [rows]);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setPayload(await platformApi.get(endpoint));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [endpoint]);

  async function submitAvailability(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const form = new FormData(event.currentTarget);
      await platformApi.saveAvailability(Object.fromEntries(form.entries()));
      event.currentTarget.reset();
      await load();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-stack" dir={dir}>
      <header className="dashboard-page-header">
        <div>
          <p className="eyebrow">Learn with Taxo</p>
          <h1>{lang === 'ar' ? titleAr : title}</h1>
          <p>{lang === 'ar' ? descriptionAr : description}</p>
        </div>
        <Button type="button" onClick={load} disabled={loading} title="Refresh">
          <RefreshCw size={18} /> {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </Button>
      </header>

      {availabilityForm && (
        <form className="form-grid" onSubmit={submitAvailability}>
          <input name="course" placeholder={lang === 'ar' ? 'الكورس' : 'Course'} required />
          <input name="level" placeholder={lang === 'ar' ? 'المستوى' : 'Level'} required />
          <input name="day" placeholder={lang === 'ar' ? 'اليوم' : 'Day'} required />
          <input name="start_time" type="time" required />
          <input name="end_time" type="time" required />
          <input name="capacity" type="number" min="1" defaultValue="1" required />
          <select name="slot_type"><option value="class">Class</option><option value="placement">Placement</option><option value="private">Private</option></select>
          <select name="status"><option value="active">Active</option><option value="inactive">Inactive</option></select>
          <Button className="form-span" disabled={saving}>{saving ? 'Saving...' : lang === 'ar' ? 'حفظ الموعد' : 'Save availability'}</Button>
        </form>
      )}

      {error && (
        <Card className="error-state">
          <AlertCircle size={22} />
          <div>
            <strong>{lang === 'ar' ? 'تعذر تحميل البيانات' : 'Data is not available yet'}</strong>
            <p>{error}</p>
          </div>
        </Card>
      )}

      {!error && loading && <Card><p>{lang === 'ar' ? 'جارٍ التحميل...' : 'Loading secure data...'}</p></Card>}
      {!error && !loading && rows.length > 0 && <DataTable rows={rows} columns={columns} />}
      {!error && !loading && rows.length === 0 && (
        <Card>
          <p>{emptyText || (lang === 'ar' ? 'لا توجد بيانات مخصصة لهذا الحساب حتى الآن.' : 'No records are assigned to this account yet.')}</p>
        </Card>
      )}

      {payload?.fetchedAt && <small>{lang === 'ar' ? 'آخر مزامنة' : 'Last synced'}: {new Date(payload.fetchedAt).toLocaleString()}</small>}
    </div>
  );
}
