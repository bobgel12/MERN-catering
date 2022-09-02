import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import Navbar from 'react-bootstrap/Navbar'
import Badge from 'react-bootstrap/Badge'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'
import { useContext } from 'react'
import { Store } from './Store'
import { Link } from 'react-router-dom'
import CartScreen from './screens/CartScreen'
import SigninScreen from './screens/SigninScreen'
import ShippingAddressScreen from './screens/ShippingAddressScreen'
import SignupScreen from './screens/SignupScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import OrderHistoryScreen from './screens/OrderHistoryScreen'
import ProfileScreen from './screens/ProfileScreen'
import SearchBox from './components/SearchBox'
import SearchScreen from './screens/SearchScreen'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardScreen from './screens/DashboardScreen'
import AdminRoute from './components/AdminRoute'
import ProductListScreen from './screens/ProductListScreen'
import ProductEditScreen from './screens/ProductEditScreen'
import OrderListScreen from './screens/OrderListScreen'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store)
  const { cart, userInfo } = state

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  return (
    <BrowserRouter>
      <div className='d-flex flex-column site-container'>
        <ToastContainer
          position='bottom-center'
          limit={1}
        />
        <header>
          <Navbar
            bg='dark'
            variant='dark'
            expand='lg'>
            <Container>
              <LinkContainer to='/'>
                <Navbar.Brand>KEVINS CATERING</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox />

                <Nav className='me-auto  w-100  justify-content-end'>
                  <Link
                    to='/cart'
                    className='nav-link'>
                    Winkelwagen
                    {cart.cartItems.length > 0 && (
                      <Badge
                        pill
                        bg='danger'>
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown
                      title={userInfo.name}
                      id='basic-nav-dropdown'>
                      <LinkContainer to='/profile'>
                        <NavDropdown.Item>Mijn profiel</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/orderhistory'>
                        <NavDropdown.Item>Mijn bestellingen</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className='dropdown-item'
                        to='#signout'
                        onClick={signoutHandler}>
                        Log uit
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link
                      className='nav-link'
                      to='/signin'>
                      Log in
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown
                      title='Admin'
                      id='admin-nav-dropdown'>
                      <LinkContainer to='/admin/dashboard'>
                        <NavDropdown.Item>Admin dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/products'>
                        <NavDropdown.Item>Gerechten</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/orders'>
                        <NavDropdown.Item>Bestellingen</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/admin/users'>
                        <NavDropdown.Item>Gebruikers</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className='mt-3'>
            <Routes>
              <Route
                path='/products'
                element={<SearchScreen />}
              />
              <Route
                path='/products/:slug'
                element={<ProductScreen />}
              />
              <Route
                path='/cart'
                element={<CartScreen />}
              />
              <Route
                path='/search'
                element={<SearchScreen />}
              />

              <Route
                path='/signin'
                element={<SigninScreen />}
              />
              <Route
                path='/signup'
                element={<SignupScreen />}
              />
              <Route
                path='/profile'
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/shipping'
                element={<ShippingAddressScreen />}></Route>
              <Route
                path='/payment'
                element={<PaymentMethodScreen />}></Route>
              <Route
                path='/placeorder'
                element={<PlaceOrderScreen />}
              />
              <Route
                path='/order/:id'
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }></Route>
              <Route
                path='/orderhistory'
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }></Route>
              {/* Admin Routes */}
              <Route
                path='/admin/dashboard'
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path='/admin/orders'
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path='/admin/users'
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path='/admin/products'
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }></Route>

              <Route
                path='/admin/product/:id'
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path='/admin/user/:id'
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }></Route>
              <Route
                path='/'
                element={<HomeScreen />}
              />
            </Routes>
          </Container>
        </main>
        <footer>
          <div className='text-center'></div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
