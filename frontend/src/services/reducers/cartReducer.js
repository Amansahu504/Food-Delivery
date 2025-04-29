import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_CART, CLEAR_CART } from '../actions/actions';

const initialState = {
  items: [],
  total: 0
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          qty: updatedItems[existingItemIndex].qty + action.payload.qty,
          finalPrice: updatedItems[existingItemIndex].finalPrice + action.payload.finalPrice
        };

        return {
          ...state,
          items: updatedItems,
          total: state.total + action.payload.finalPrice
        };
      }

      // If item doesn't exist, add it to cart
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.finalPrice
      };

    case REMOVE_FROM_CART:
      const itemToRemove = state.items.find(item => item.id === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (itemToRemove ? itemToRemove.finalPrice : 0)
      };

    case UPDATE_CART:
      const { itemId, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id === itemId) {
            const newPrice = (item.finalPrice / item.qty) * quantity;
            return {
              ...item,
              qty: quantity,
              finalPrice: newPrice
            };
          }
          return item;
        }),
        total: state.items.reduce((acc, item) => {
          if (item.id === itemId) {
            return acc + ((item.finalPrice / item.qty) * quantity);
          }
          return acc + item.finalPrice;
        }, 0)
      };

    case CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

export default cartReducer; 