import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'


// Komponentti AnimalForm, jolla voidaan lisätä uusia eläimiä eläintarhaan. Ei voi lisätä jos tyhjiä kenttiä.
const AnimalForm = ({ newName, newSpecies, newEnvironment, onNameChange, onSpeciesChange, onEnvironmentChange, onSubmit }) => {
  const canAddAnimal = newName.trim() !== '' && newSpecies.trim() !== '';
  return (
    <form onSubmit={onSubmit}>
      <h2>Add a New Animal to Zoo</h2>
      <div>
        Name: <input value={newName} onChange={onNameChange} /> 
      </div>
      <div>
        Species: <input value={newSpecies} onChange={onSpeciesChange} />
      </div>
      <div>
        Environment:
        <select onChange={onEnvironmentChange}>
          <option value="aquarium">Aquarium</option>
          <option value="safari">Safari</option>
          <option value="pettingZoo">Petting Zoo</option>
        </select>
      </div>
      <div>
        <button type="submit" disabled={!canAddAnimal}>Add</button>
      </div>
    </form>
  );
};


// Komponentti Filter eläinten etsimiseen nimen tai lajin perusteella
const Filter = ({ value, onChange }) => {
  return (
    <div>
      Find animals by name or species <input value={value} onChange={onChange} />
    </div>
  );
};

// Pääkomponentti Zoo
const Zoo = () => {
  const [animals, setAnimals] = useState([]);
  const [newName, setNewName] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('aquarium');
  const [filter, setFilter] = useState('');

// Haetaan alustava lista eläimistä palvelimelta Axiosilla
  useEffect(() => {
    axios.get('http://localhost:3001/animals').then((response) => setAnimals(response.data));
  }, []);

// Tapahtumankäsittelijät päivittelemään tila käyttäjän syötteen perusteella
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleSpeciesChange = (event) => {
    setNewSpecies(event.target.value);
  };
  const handleEnvironmentChange = (event) => {
    setNewEnvironment(event.target.value);
  };  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

// Lisäillään uusia eläimiä eläintarhaan
  const addAnimal = (event) => {
    event.preventDefault();

// Tarkistetaan, onko löytyykö tätä eläintä jo eläintarhasta (nimi ja laji samat)
    const existingAnimal = animals.find(
      (animal) => animal.name.toLowerCase() === newName.toLowerCase() && animal.species.toLowerCase() === newSpecies.toLowerCase()
    );
// Tarkistetaan, löytyykö samannimisiä, mutta eri lajisia
    const existingSameName = animals.find(
      (animal) => animal.name.toLowerCase() === newName.toLowerCase() && animal.species.toLowerCase() !== newSpecies.toLowerCase()
    );
// Jos löytyy tismalleen sama eläin, sanotaan soo soo
    if (existingAnimal) {
      alert(`There is already '${newName}' with species '${newSpecies}' in the Zoo.`);
      return;
    }
// Saa halutessa lisätä, jos vain nimi on sama
    if (existingSameName) {
      const userConfirmed = window.confirm(
        `There is already '${newName}' with a different species in the Zoo.\nDo you want to bring another '${newName}' with the new species (${newSpecies}) into the Zoo?`
      );
    
      if (!userConfirmed) {
        return;
      }
    }

// Lisätään uusi eläin eläinten listaan
    const newAnimal = { name: newName, species: newSpecies, environment: newEnvironment };
    setAnimals([...animals, newAnimal]);
    setNewName('');
    setNewSpecies('');
  };

// Suodatellaan eläimiä hakufiltterillä
  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(filter.toLowerCase()) ||
      animal.species.toLowerCase().includes(filter.toLowerCase()) ||
      animal.environment.toLowerCase().includes(filter.toLowerCase())
  );

// Erotellaan eläimet elinympäristön mukaan
  const aquariumAnimals = filteredAnimals.filter((animal) => animal.environment.toLowerCase() === 'aquarium');
  const safariAnimals = filteredAnimals.filter((animal) => animal.environment.toLowerCase() === 'safari');
  const pettingZooAnimals = filteredAnimals.filter((animal) => animal.environment.toLowerCase() === 'pettingzoo');

// Renderöidään Zoo-komponentti
  return (
    <div className="container">

      <div className="header">
        <h1>the Zoo</h1>
      </div>

      <div className = "row"></div>

      <div className="add">
        <AnimalForm
          newName={newName}
          newSpecies={newSpecies}
          newEnvironment={newEnvironment}
          onNameChange={handleNameChange}
          onSpeciesChange={handleSpeciesChange}
          onEnvironmentChange={handleEnvironmentChange}
          onSubmit={addAnimal}
        />
      </div>

      <div className = "row"></div>

      <div className="animals-header">
          <h2>Our Animals</h2>
          <Filter value={filter} onChange={handleFilterChange} />
        </div>

      <div class = "smallrow"></div>

      <div className="animals">
        <div className="aquarium">
          <h3>Aquarium</h3>
          <ul>
            {aquariumAnimals.map((animal, index) => (
              <li key={index}>
                {animal.name} - {animal.species}
              </li>
            ))}
          </ul>
        </div>

        <div className="safari">
          <h3>Safari</h3>
          <ul>
            {safariAnimals.map((animal, index) => (
              <li key={index}>
                {animal.name} - {animal.species}
              </li>
            ))}
          </ul>
        </div>

        <div className="pettingzoo">
          <h3>Petting Zoo</h3>
          <ul>
            {pettingZooAnimals.map((animal, index) => (
              <li key={index}>
                {animal.name} - {animal.species}
              </li>
            ))}
          </ul>
        </div>
      </div> 

    </div>
  );
};

export default Zoo;
