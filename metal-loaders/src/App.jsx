import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoadingLibrary from './pages/LoadingLibrary';
import IconLibraryPage from './pages/IconLibraryPage';
import AnimationLibrary from './pages/AnimationLibrary';
import StylingPage from './pages/StylingPage';
import './styles/global.css';
import './styles/components.css';
import './styles/animations.css';
import './styles/uiAnimations.css';
import './styles/styleEffects.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/loaders" element={<LoadingLibrary/>}/>
          <Route path="/icons" element={<IconLibraryPage/>}/>
          <Route path="/animations" element={<AnimationLibrary/>}/>
          <Route path="/styling" element={<StylingPage/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
