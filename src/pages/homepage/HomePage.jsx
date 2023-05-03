// Infrastructure
import { Fragment } from "react";
import { useState, useEffect } from "react";
// Components
import SportsList from "../../components/sportslist/SportsList";
import NavBar from "../../components/navbar/Navbar";
import FilterBar from "../../components/filterbar/FilterBar";
// Styling
import "./HomePage.scss";
import LeaguePage from "../leaguepage/LeaguePage";

const HomePage = () => {
  // States for all leagues, all countries data from API, filtered leagues and search input
  const [leagues, setLeagues] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filteredLeagues, setFilteredLeagues] = useState([]);
  const [filterEmpty, setFilterEmpty] = useState(true);
  const [leagueSearch, setLeagueSearch] = useState('');

  // Fetch all countries and all leagues data from API
  useEffect(() => {
    fetch("https://www.thesportsdb.com/api/v1/json/3/all_leagues.php")
      .then((res) => res.json())
      .then((leagues) => {
        setLeagues(leagues)
      })
      ;
    fetch("https://www.thesportsdb.com/api/v1/json/3/all_countries.php")
      .then((res) => res.json())
      .then((countries) => setCountries(countries));
  }, []);

  // Checking if object is empty for async fetch
  const isObjEmpty = (leagues) => {
    return Object.keys(leagues).length === 0;
  };

  // Fetch data from API according to selected countries and sports selected in FilterBar
  const handleFilterData = async (selectedCountries, selectedSports) => {
    // Array for filtered leagues
    const filteredLeagues = [];
    // Fetching data from API for each country and sport according to selected countries and sports from FilterBar
    for (const country of selectedCountries) {
      for (const sport of selectedSports) {
        const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?c=${country}&s=${sport}`);
        const leagues = await res.json();
        if (leagues.countries !== null) {
          const mappedLeagues = leagues.countries.map(league => ({
            idLeague: league.idLeague,
            strLeague: league.strLeague,
            strSport: league.strSport
          }));
          filteredLeagues.push(...mappedLeagues);
        }
      }
    }
    setFilteredLeagues(filteredLeagues);
  }

  const handleFilterEmpty = (boolean) => {
    setFilterEmpty(boolean);
  }

  if (isObjEmpty(leagues) === true) {
    return <div>loading</div>;
  } else {
    return (
      <Fragment>
        <NavBar
          leagueSearch={leagueSearch}
          setLeagueSearch={setLeagueSearch} />
        <FilterBar
          leagues={leagues}
          countries={countries}
          onFilterData={handleFilterData}
          onFilterEmpty={handleFilterEmpty} />
        <SportsList
          leagues={leagues}
          filteredLeagues={filteredLeagues}
          filterEmpty={filterEmpty}
          leagueSearch={leagueSearch} />
      </Fragment>
    );
  }
};

export default HomePage;
