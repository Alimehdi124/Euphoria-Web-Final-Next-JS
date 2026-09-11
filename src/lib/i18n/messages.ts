export type Locale = "en" | "az" | "ru";

export const messages: Record<Locale, Record<string, string>> = {
  en: {
    "nav.shop": "Shop", "nav.men": "Men", "nav.women": "Women", "nav.combos": "Combos", "nav.joggers": "Joggers",
    "common.search": "Search", "common.language": "Language", "common.wishlist": "Wishlist", "common.account": "Account", "common.cart": "Shopping bag",
    "catalog.filters": "Filters", "catalog.items": "items", "catalog.sort": "Sort by", "catalog.recommended": "Recommended", "catalog.empty": "No products found",
    "admin.dashboard": "Dashboard", "admin.products": "Products", "admin.categories": "Categories", "admin.orders": "Orders", "admin.users": "Users", "admin.signOut": "Sign out"
  },
  az: {
    "nav.shop": "Mağaza", "nav.men": "Kişilər", "nav.women": "Qadınlar", "nav.combos": "Dəstlər", "nav.joggers": "Joggerlər",
    "common.search": "Axtar", "common.language": "Dil", "common.wishlist": "İstək siyahısı", "common.account": "Hesab", "common.cart": "Səbət",
    "catalog.filters": "Filterlər", "catalog.items": "məhsul", "catalog.sort": "Sırala", "catalog.recommended": "Tövsiyə edilən", "catalog.empty": "Məhsul tapılmadı",
    "admin.dashboard": "Panel", "admin.products": "Məhsullar", "admin.categories": "Kateqoriyalar", "admin.orders": "Sifarişlər", "admin.users": "İstifadəçilər", "admin.signOut": "Çıxış"
  },
  ru: {
    "nav.shop": "Магазин", "nav.men": "Мужское", "nav.women": "Женское", "nav.combos": "Комплекты", "nav.joggers": "Джоггеры",
    "common.search": "Поиск", "common.language": "Язык", "common.wishlist": "Избранное", "common.account": "Аккаунт", "common.cart": "Корзина",
    "catalog.filters": "Фильтры", "catalog.items": "товаров", "catalog.sort": "Сортировка", "catalog.recommended": "Рекомендуемые", "catalog.empty": "Товары не найдены",
    "admin.dashboard": "Панель", "admin.products": "Товары", "admin.categories": "Категории", "admin.orders": "Заказы", "admin.users": "Пользователи", "admin.signOut": "Выйти"
  }
};
