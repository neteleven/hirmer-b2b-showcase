import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/home'
import Cart from './pages/cart'
import QuickOrder from './pages/quickorder'
import AboutUs from './pages/aboutus'
import Checkout from './pages/checkout'
import ProductList, { ProductDetails } from './pages/product'
import Account from './pages/account'
import AccountHome from './pages/account/AccountHome'
import MyAccount from './pages/account/MyAccount'
import AccountPersonalDetails from './pages/account/AccountPersonalDetails'
import AccountCompanyDetails from './pages/account/AccountCompanyDetails'
import AccountMyOrders from './pages/account/AccountMyOrders'
import AccountMyQuotes from './pages/account/AccountMyQuotes'
import AccountMyQuoteDetails from './pages/account/AccountMyQuoteDetails'
import AccountMyOrdersView from './pages/account/AccountMyOrdersView'
import AccountMyOrdersInvoice from './pages/account/AccountMyOrdersInvoice'
import AccountReplenishmentOrders from './pages/account/AccountReplenishmentOrders'
import AccountReplenishmentAddOrders from './pages/account/AccountReplenishmentAddOrders'
import AccountReplenishmentEditOrders from './pages/account/AccountReplenishmentEditOrders'
import AccountSavedCarts from './pages/account/AccountSavedCarts'
import AccountLocations from './pages/account/AccountLocations'
import Brand from './pages/brand'
import AccountAddLocations from './pages/account/AccountAddLocations'
import AccountPayments from './pages/account/AccountPayments'
import AccountReviews from './pages/account/AccountReviews'
import AccountPaymentsEditCardDetails from './pages/account/AccountPaymentsEditCardDetails'
import NoPage from './pages/NoPage'
import { history } from './helpers/history'
import { clearMessage } from './redux/slices/messageReducer'
import InvalidTenant from './pages/InvalidTenant'
import QuoteCart from './pages/quote'
import AccountReturns from 'pages/account/AccountReturns'

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage())
    })
  }, [dispatch])

  return (
    <Router>
      <Routes>
        <Route path="/:tenant">
          <Route index exact element={<Home />} />
          <Route path="product/:maincategory" exact element={<ProductList />} />
          <Route
            path="product/:maincategory/:subcategory/"
            exact
            element={<ProductList />}
          />
          <Route
            path="product/:maincategory/:subcategory/:category"
            exact
            element={<ProductList />}
          />
          <Route
            path="product/details/:productId"
            element={<ProductDetails />}
          />
          <Route path="login" exact element={<Login />} />
          <Route path="signup" exact element={<Signup />} />
          <Route path="brand" exact element={<Brand />} />
          <Route path="cart" exact element={<Cart />} />
          <Route path="checkout" exact element={<Checkout />} />
          <Route path="quote" exact element={<QuoteCart />} />
          <Route path="my-account" element={<Account />}>
            <Route index element={<AccountHome />} />
            <Route path="account-summary" element={<MyAccount />} />
            <Route
              path="personal-details"
              element={<AccountPersonalDetails />}
            />
            <Route path="company-details" element={<AccountCompanyDetails />} />
            <Route path="my-orders" exact element={<AccountMyOrders />} />
            <Route path="my-quotes" exact element={<AccountMyQuotes />} />
            <Route
              path="my-quotes/:quoteId"
              element={<AccountMyQuoteDetails />}
            />
            <Route
              path="my-orders/view/:orderId"
              exact
              element={<AccountMyOrdersView />}
            />
            <Route
              path="my-orders/invoice/:orderId"
              exact
              element={<AccountMyOrdersInvoice />}
            />
            <Route path="returns" exact element={<AccountReturns />} />
            <Route
              path="replenishment-orders"
              exact
              element={<AccountReplenishmentOrders />}
            />
            <Route
              path="replenishment-orders/add"
              exact
              element={<AccountReplenishmentAddOrders />}
            />
            <Route
              path="replenishment-orders/edit"
              exact
              element={<AccountReplenishmentEditOrders />}
            />
            <Route path="saved-carts" element={<AccountSavedCarts />} />
            <Route path="locations" exact element={<AccountLocations />} />
            <Route
              path="locations/add"
              exact
              element={<AccountAddLocations />}
            />
            <Route path="payments" exact element={<AccountPayments />} />
            <Route
              path="payments/edit_card_details"
              element={<AccountPaymentsEditCardDetails />}
            />
            <Route path="reviews" element={<AccountReviews />} />
          </Route>
          <Route path="quick_order" element={<QuickOrder />} />
          <Route path="aboutus" element={<AboutUs />} />
          <Route path="*" element={<NoPage />} />
        </Route>
        <Route path="*" element={<InvalidTenant />} />
      </Routes>
    </Router>
  )
}
export default App
