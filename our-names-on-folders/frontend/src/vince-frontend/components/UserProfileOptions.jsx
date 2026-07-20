import { useState } from 'react';

const API_URL = 'http://localhost:3001';

function UserProfileOptions({ userId, currentBio, isOwnProfile, onUpdated }) {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(currentBio || '');
  const [saving, setSaving] = useState(false);

  if (!isOwnProfile) {
    return null;
  }

  function handleSave() {
    setSaving(true);
    fetch(API_URL + '/users/' + userId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: bio })
    })
      .then(() => {
        setEditing(false);
        setSaving(false);
        if (onUpdated) onUpdated(bio);
      })
      .catch(err => {
        console.log(err);
        setSaving(false);
      });
  }

  if (!editing) {
    return <button onClick={() => setEditing(true)}>Edit Profile</button>;
  }

  return (
    <div>
      <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ width: '100%' }} />
      <div>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        <button onClick={() => { setEditing(false); setBio(currentBio || ''); }}>Cancel</button>
      </div>
    </div>
  );
}

export default UserProfileOptions;