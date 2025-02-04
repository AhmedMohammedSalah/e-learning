// Retrieve data from LocalStorage
function fetchData(key) {
  // Get the data from LocalStorage using the provided key
  const data = localStorage.getItem(key);

  // If data exists, parse it from JSON string to JavaScript object/array
  if (data) {
    return JSON.parse(data);
  }

  // If no data is found, return null or an empty array/object
  return null;
}

// Save data to LocalStorage
function saveData(key, data) {
  // Convert the data to a JSON string and save it to LocalStorage
  localStorage.setItem(key, JSON.stringify(data));
}

// Remove data from LocalStorage
function removeData(key) {
  // Remove the data associated with the provided key from LocalStorage
  localStorage.removeItem(key);
}

// Function to read, update, delete, and create specific objects in an array
function manageSpecific(key, id, value, action) {
  const data = fetchData(key) || []; // Fetch existing data or initialize as an empty array

  switch (action) {
    case "read":
      // Find and return the specific object by id
      return data.find((element) => element.id === id) || null;

    case "update":
      // Update the specific object by id
      const indexToUpdate = data.findIndex((element) => element.id === id);
      if (indexToUpdate !== -1) {
        data[indexToUpdate] = { ...data[indexToUpdate], ...value }; // Merge existing object with new values
        saveData(key, data); // Save updated data back to LocalStorage
        return data[indexToUpdate]; // Return the updated object
      }
      return null;

    case "delete":
      // Delete the specific object by id
      const indexToDelete = data.findIndex((element) => element.id === id);
      if (indexToDelete !== -1) {
        const deletedItem = data.splice(indexToDelete, 1); // Remove the item from the array
        saveData(key, data); // Save updated data back to LocalStorage
        return deletedItem[0]; // Return the deleted object
      }
      return null;

    case "create":
      // Create a new object and add it to the array
      data.push({ id, ...value }); // Add new object with id and other properties
      saveData(key, data); // Save updated data back to LocalStorage
      return data[data.length - 1]; // Return the newly created object

    default:
      throw new Error(
        'Invalid action specified. Use "read", "update", "delete", or "create".'
      );
  }
}

// Retrieve data from Session Storage
function fetchSessionData(key) {
  const data = sessionStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

// Save data to Session Storage
function saveSessionData(key, data) {
  sessionStorage.setItem(key, JSON.stringify(data));
}

// Remove data from Session Storage
function removeSessionData(key) {
  sessionStorage.removeItem(key);
}

// Function to manage specific objects in an array (Session Storage)
function manageSessionSpecific(key, id, value, action) {
  const data = fetchSessionData(key) || [];

  switch (action) {
    case "read":
      return data.find((element) => element.id === id) || null;

    case "update":
      const indexToUpdate = data.findIndex((element) => element.id === id);
      if (indexToUpdate !== -1) {
        data[indexToUpdate] = { ...data[indexToUpdate], ...value };
        saveSessionData(key, data);
        return data[indexToUpdate];
      }
      return null;

    case "delete":
      const indexToDelete = data.findIndex((element) => element.id === id);
      if (indexToDelete !== -1) {
        const deletedItem = data.splice(indexToDelete, 1);
        saveSessionData(key, data);
        return deletedItem[0];
      }
      return null;

    case "create":
      data.push({ id, ...value });
      saveSessionData(key, data);
      return data[data.length - 1];

    default:
      throw new Error(
        'Invalid action specified. Use "read", "update", "delete", or "create".'
      );
  }
}
// Retrieve data from Cookies
function fetchCookieData(key) {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
  const cookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));
  if (cookie) {
    const value = cookie.split("=")[1];
    return JSON.parse(decodeURIComponent(value));
  }
  return null;
}

// Save data to Cookies
function saveCookieData(key, data, expiresInDays = 7) {
  const date = new Date();
  date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${key}=${encodeURIComponent(
    JSON.stringify(data)
  )};${expires};path=/`;
}

// Remove data from Cookies
function removeCookieData(key) {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Function to manage specific objects in an array (Cookies)
function manageCookieSpecific(key, id, value, action) {
  const data = fetchCookieData(key) || [];

  switch (action) {
    case "read":
      return data.find((element) => element.id === id) || null;

    case "update":
      const indexToUpdate = data.findIndex((element) => element.id === id);
      if (indexToUpdate !== -1) {
        data[indexToUpdate] = { ...data[indexToUpdate], ...value };
        saveCookieData(key, data);
        return data[indexToUpdate];
      }
      return null;

    case "delete":
      const indexToDelete = data.findIndex((element) => element.id === id);
      if (indexToDelete !== -1) {
        const deletedItem = data.splice(indexToDelete, 1);
        saveCookieData(key, data);
        return deletedItem[0];
      }
      return null;

    case "create":
      data.push({ id, ...value });
      saveCookieData(key, data);
      return data[data.length - 1];

    default:
      throw new Error(
        'Invalid action specified. Use "read", "update", "delete", or "create".'
      );
  }
}

const Storage = {
  // LocalStorage
  fetchLocalData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  saveLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },
  removeLocalData(key) {
    localStorage.removeItem(key);
  },
  manageLocalSpecific(key, id, value, action) {
    const data = this.fetchLocalData(key) || [];
    return manageSpecific(data, id, value, action, (updatedData) =>
      this.saveLocalData(key, updatedData)
    );
  },

  // Session Storage
  fetchSessionData(key) {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  saveSessionData(key, data) {
    sessionStorage.setItem(key, JSON.stringify(data));
  },
  removeSessionData(key) {
    sessionStorage.removeItem(key);
  },
  manageSessionSpecific(key, id, value, action) {
    const data = this.fetchSessionData(key) || [];
    return manageSpecific(data, id, value, action, (updatedData) =>
      this.saveSessionData(key, updatedData)
    );
  },

  // Cookies
  fetchCookieData(key) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const cookie = cookies.find((cookie) => cookie.startsWith(`${key}=`));
    if (cookie) {
      const value = cookie.split("=")[1];
      return JSON.parse(decodeURIComponent(value));
    }
    return null;
  },
  saveCookieData(key, data, expiresInDays = 7) {
    const date = new Date();
    date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${key}=${encodeURIComponent(
      JSON.stringify(data)
    )};${expires};path=/`;
  },
  removeCookieData(key) {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  },
  manageCookieSpecific(key, id, value, action) {
    const data = this.fetchCookieData(key) || [];
    return manageSpecific(data, id, value, action, (updatedData) =>
      this.saveCookieData(key, updatedData)
    );
  },
};

// callback function for managing specific objects
function manageSpecific(data, id, value, action, saveCallback) {
  switch (action) {
    case "read":
      return data.find((element) => element.id === id) || null;

    case "update":
      const indexToUpdate = data.findIndex((element) => element.id === id);
      if (indexToUpdate !== -1) {
        data[indexToUpdate] = { ...data[indexToUpdate], ...value };
        saveCallback(data);
        return data[indexToUpdate];
      }
      return null;

    case "delete":
      const indexToDelete = data.findIndex((element) => element.id === id);
      if (indexToDelete !== -1) {
        const deletedItem = data.splice(indexToDelete, 1);
        saveCallback(data);
        return deletedItem[0];
      }
      return null;

    case "create":
      data.push({ id, ...value });
      saveCallback(data);
      return data[data.length - 1];

    default:
      throw new Error(
        'Invalid action specified. Use "read", "update", "delete", or "create".'
      );
  }
}
