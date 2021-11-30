import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import BlogPage from './pages/BlogPage';
import ContactoPage from './pages/ContactoPage';
import HomePage from './pages/HomePage';
import NosotrosPage from './pages/NosotrosPage';
import ObrasPage from './pages/ObrasPage';
import PostsPage from './pages/PostsPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-header-container">
          <Header />
        </div>
        <Switch>
          <Route path='/' exact component={HomePage} />
          <Route path='/blog' exact component={BlogPage} />
          <Route path='/blog/posts' exact component={PostsPage} />
          <Route path='/obras' exact component={ObrasPage} />
          <Route path='/nosotros' exact component={NosotrosPage} />
          <Route path='/contacto' exact component={ContactoPage} />
        </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
