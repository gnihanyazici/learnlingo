export const FilterBar = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="language">Languages</label>
        <select id="language" name="language" value={filters.language} onChange={handleChange}>
          <option value="">All</option>
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Mandarin">Mandarin</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="level">Level of knowledge</label>
        <select id="level" name="level" value={filters.level} onChange={handleChange}>
          <option value="">All</option>
          <option value="A1 Beginner">A1 Beginner</option>
          <option value="A2 Elementary">A2 Elementary</option>
          <option value="B1 Intermediate">B1 Intermediate</option>
          <option value="B2 Upper-Intermediate">B2 Upper-Intermediate</option>
          <option value="C1 Advanced">C1 Advanced</option>
          <option value="C2 Proficient">C2 Proficient</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="price">Price (per hour)</label>
        <select id="price" name="price" value={filters.price} onChange={handleChange}>
          <option value="">All</option>
          <option value="20">Up to $20</option>
          <option value="30">Up to $30</option>
          <option value="40">Up to $40</option>
          <option value="50">Up to $50</option>
        </select>
      </div>
    </div>
  );
};