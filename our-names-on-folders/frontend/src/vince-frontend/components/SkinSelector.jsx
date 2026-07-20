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
      <input
        type="text"
        placeholder="Search skins..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <select value={weaponFilter} onChange={e => setWeaponFilter(e.target.value)}>
        <option value="All">All</option>
        {weaponNames.map(name => <option key={name} value={name}>{name}</option>)}
      </select>

      <select value={rarityFilter} onChange={e => setRarityFilter(e.target.value)}>
        <option value="All">All</option>
        {rarityNames.map(name => <option key={name} value={name}>{name}</option>)}
      </select>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredSkins.slice(0, 100).map(skin => (
          <div
            key={skin.uuid}
            onClick={() => toggleSkin(skin)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: selectedSkins.find(s => s.uuid === skin.uuid) ? '#d0e8ff' : 'transparent',
              padding: '4px'
            }}
          >
            {skin.displayIcon && <img src={skin.displayIcon} alt={skin.displayName} width="40" />}
            <span style={{ marginLeft: '8px' }}>{skin.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkinSelector;