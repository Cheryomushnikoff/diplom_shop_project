export const loadGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem("guestCart")) || [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (items) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

export const clearGuestCart = () => {
  localStorage.removeItem("guestCart");
};

