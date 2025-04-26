import { Input, Radio, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const SearchBar = ({
  searchType,
  setSearchType,
  searchField,
  setSearchField,
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Radio.Group
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
      >
        <Radio.Button value="local">Local</Radio.Button>
        <Radio.Button value="global">Global</Radio.Button>
      </Radio.Group>

      <Radio.Group
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        <Radio.Button value="symbol">Symbol</Radio.Button>
        <Radio.Button value="companyName">Company Name</Radio.Button>
      </Radio.Group>

      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-64"
      />

      <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
    </div>
  );
};

export default SearchBar;
