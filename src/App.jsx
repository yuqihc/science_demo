import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PhysicsHome from './pages/PhysicsHome';
import Acceleration from './pages/Acceleration';
import OpticsLab from './pages/OpticsLab';
import MathHome from './pages/MathHome';
import NumberSense20 from './pages/NumberSense20';
import MathAddSubtract from './pages/MathAddSubtract';
import MathCarryAdd from './pages/MathCarryAdd';
import SolidShapes from './pages/SolidShapes';
import EquationSolver from './pages/math/EquationSolver';
import PlaceValue2D from './pages/math/PlaceValue2D';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/physics" element={<PhysicsHome />} />
        <Route path="/physics/acceleration" element={<Acceleration />} />
        <Route path="/physics/optics" element={<OpticsLab />} />
        
        {/* Math Routes */}
        <Route path="/math" element={<MathHome />} />
        <Route path="/math/number-sense-20" element={<NumberSense20 />} />
        <Route path="/math/add-subtract" element={<MathAddSubtract />} />
        <Route path="/math/carry-add" element={<MathCarryAdd />} />
        <Route path="/math/solid-shapes" element={<SolidShapes />} />
        <Route path="/math/equation-solver" element={<EquationSolver />} />
        <Route path="/math/place-value-2d" element={<PlaceValue2D />} />
        
        {/* Placeholder for other routes */}
        <Route path="/chemistry" element={<div className="main-container" style={{textAlign: 'center'}}><h2>化学模块开发中...</h2><Link to="/" className="nav-btn">返回首页</Link></div>} />
      </Routes>
    </Router>
  );
}

export default App;
