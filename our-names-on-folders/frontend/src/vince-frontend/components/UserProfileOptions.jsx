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
    return (
      <button
        onClick={() => setEditing(true)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #3a4255',
          backgroundColor: '#111823',
          color: '#f0f0f0',
          cursor: 'pointer'
        }}
      >
        Edit Profile
      </button>
    );
  }

  return (
    <div>
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        rows={4}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '6px',
          border: '1px solid #3a4255',
          backgroundColor: '#111823',
          color: '#fff',
          boxSizing: 'border-box',
          marginBottom: '10px'
        }}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: saving ? '#555' : '#ff4655',
            color: '#fff',
            fontWeight: 'bold',
            cursor: saving ? 'not-allowed' : 'pointer'
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => {
            setEditing(false);
            setBio(currentBio || '');
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #3a4255',
            backgroundColor: '#111823',
            color: '#f0f0f0',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default UserProfileOptions;
