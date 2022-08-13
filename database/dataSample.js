const fakeEntrySanFrancisco = {
  name: "Shannon",
  profile_picture: "url1.com",
  username: "plantLover69",
  password: "h1n1",
  plants: [
    {
      name: "papaver somniferum",
      category: ["small", "outdoor"],
      photo: "url2.com",
    },
    {
      name: "papaver somniferum",
      category: ["small", "outdoor"],
      photo: "url2.com",
    },
  ],
  location: {
    type: "Point",
    coordinates: [122.4194, 37.7749],
  },
};

const fakeEntryDalyCity = {
  name: "S",
  profile_picture: "url1.com",
  username: "dalyCityLiver",
  password: "h1n1",
  plants: [
    {
      name: "papaver somniferum",
      category: ["small", "outdoor"],
      photo: "url2.com",
    },
    {
      name: "papaver somniferum",
      category: ["small", "outdoor"],
      photo: "url2.com",
    },
  ],
  location: {
    type: "Point",
    coordinates: [122.4702, 37.6879],
  },
};

console.log(fakeEntryDalyCity, fakeEntrySanFrancisco);
