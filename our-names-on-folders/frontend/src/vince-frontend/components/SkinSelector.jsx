import { useState, useEffect } from 'react';

function SkinSelector({ selectedSkins, onChange }) {
  const [allSkins, setAllSkins] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [weaponFilter, setWeaponFilter] = useState('All');
  const [rarityFilter, setRarityFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://valorant-api.com/v1/weapons/skins')
      .then(res => res.json())
      .then(data => {
        setAllSkins(data.data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch('https://valorant-api.com/v1/weapons')
      .then(res => res.json())
      .then(data => setWeapons(data.data));
  }, []);

  useEffect(() => {
    fetch('https://valorant-api.com/v1/contenttiers')
      .then(res => res.json())
      .then(data => setTiers(data.data));
  }, []);

  function findWeaponName(skinUuid) {
    for (let i = 0; i < weapons.length; i++) {
      const match = weapons[i].skins.find(s => s.uuid === skinUuid);
      if (match) return weapons[i].displayName;
    }
    return '';
  }

  function findRarityName(tierUuid) {
    const tier = tiers.find(t => t.uuid === tierUuid);
    return tier ? tier.displayName : '';
  }

  let filteredSkins = allSkins;

  if (searchTerm) {
    filteredSkins = filteredSkins.filter(skin =>
      skin.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (weaponFilter !== 'All') {
    filteredSkins = filteredSkins.filter(skin => findWeaponName(skin.uuid) === weaponFilter);
  }

  if (rarityFilter !== 'All') {
    filteredSkins = filteredSkins.filter(skin => findRarityName(skin.contentTierUuid) === rarityFilter);
  }

  console.log(filteredSkins.length);

  function toggleSkin(skin) {
    const alreadyIn = selectedSkins.find(s => s.uuid === skin.uuid);
    if (alreadyIn) {
      onChange(selectedSkins.filter(s => s.uuid !== skin.uuid));
    } else {
      onChange([...selectedSkins, {
        uuid: skin.uuid,
        name: skin.displayName,
        icon: skin.displayIcon
      }]);
    }
  }

  if (loading) return <p>Loading skins...</p>;

  const weaponNames = [];
  weapons.forEach(w => {
    if (!weaponNames.includes(w.displayName)) weaponNames.push(w.displayName);
  });

  const rarityNames = [];
  tiers.forEach(t => {
    if (!rarityNames.includes(t.displayName)) rarityNames.push(t.displayName);
  });

  return (
    <div>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: '#9aa3b5', fontSize: '13px' }}>
            Search
          </label>
          <input
            type="text"
            placeholder="Search skins..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '300px',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #3a4255',
              backgroundColor: '#111823',
              color: '#fff',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#9aa3b5', fontSize: '13px' }}>
              Weapon
            </label>
            <select
              value={weaponFilter}
              onChange={e => setWeaponFilter(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #3a4255',
                backgroundColor: '#111823',
                color: '#fff'
              }}
            >
              <option value="All">All weapons</option>
              {weaponNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', color: '#9aa3b5', fontSize: '13px' }}>
              Rarity
            </label>
            <select
              value={rarityFilter}
              onChange={e => setRarityFilter(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #3a4255',
                backgroundColor: '#111823',
                color: '#fff'
              }}
            >
              <option value="All">All rarities</option>
              {rarityNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', maxHeight: '500px', overflowY: 'auto', marginTop: '12px', paddingRight: '12px' }}>
        {filteredSkins.slice(0, 100).map(skin => (
          <div
            key={skin.uuid}
            onClick={() => toggleSkin(skin)}
            style={{
              flex: '1 1 180px',
              maxWidth: 'calc(20% - 13px)',
              boxSizing: 'border-box',
              textAlign: 'center',
              cursor: 'pointer',
              padding: '10px',
              borderRadius: '8px',
              border: selectedSkins.find(s => s.uuid === skin.uuid) ? '2px solid #ff4655' : '1px solid #3a4255',
              backgroundColor: selectedSkins.find(s => s.uuid === skin.uuid) ? '#1a2230' : '#111823'
            }}
          >
            {skin.displayIcon ? (
              <img
                src={skin.displayIcon}
                alt={skin.displayName}
                style={{ width: '100%', maxWidth: '170px', height: '170px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{
                width: '100%',
                maxWidth: '170px',
                height: '170px',
                margin: '0 auto',
                backgroundColor: '#1a2230',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9aa3b5',
                fontSize: '13px'
              }}>
                No image
              </div>
            )}
            <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '16px', color: '#f0f0f0' }}>
              {skin.displayName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkinSelector;