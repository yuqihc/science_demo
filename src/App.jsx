import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

const PhysicsHome = lazy(() => import('./pages/PhysicsHome'));
const Acceleration = lazy(() => import('./pages/Acceleration'));
const OpticsLab = lazy(() => import('./pages/OpticsLab'));
const MathHome = lazy(() => import('./pages/MathHome'));
const NumberSense20 = lazy(() => import('./pages/NumberSense20'));
const MathAddSubtract = lazy(() => import('./pages/MathAddSubtract'));
const MathCarryAdd = lazy(() => import('./pages/MathCarryAdd'));
const SolidShapes = lazy(() => import('./pages/SolidShapes'));
const SubtractBreakTen = lazy(() => import('./pages/SubtractBreakTen'));
const EquationSolver = lazy(() => import('./pages/math/EquationSolver'));
const PlaceValue2D = lazy(() => import('./pages/math/PlaceValue2D'));
const MixedOperationsDemo = lazy(() => import('./pages/math/ArithmeticDemos').then((module) => ({ default: module.MixedOperationsDemo })));
const ChainOperationsDemo = lazy(() => import('./pages/math/ArithmeticDemos').then((module) => ({ default: module.ChainOperationsDemo })));
const MakeTenFriendsDemo = lazy(() => import('./pages/math/ArithmeticDemos').then((module) => ({ default: module.MakeTenFriendsDemo })));
const WordProblemDemo = lazy(() => import('./pages/math/ArithmeticDemos').then((module) => ({ default: module.WordProblemDemo })));
const VerticalArithmeticDemo = lazy(() => import('./pages/math/ArithmeticDemos').then((module) => ({ default: module.VerticalArithmeticDemo })));

function RouteLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        color: '#334155',
        fontSize: 16,
        fontWeight: 800
      }}
    >
      正在加载...
    </div>
  );
}

function App() {
  return (
    <Router>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/physics" element={<PhysicsHome />} />
          <Route path="/physics/acceleration" element={<Acceleration />} />
          <Route path="/physics/optics" element={<OpticsLab />} />

          <Route path="/math" element={<MathHome />} />
          <Route path="/math/number-sense-20" element={<NumberSense20 />} />
          <Route path="/math/add-subtract" element={<MathAddSubtract />} />
          <Route path="/math/carry-add" element={<MathCarryAdd />} />
          <Route path="/math/subtract-break-ten" element={<SubtractBreakTen />} />
          <Route path="/math/solid-shapes" element={<SolidShapes />} />
          <Route path="/math/equation-solver" element={<EquationSolver />} />
          <Route path="/math/place-value-2d" element={<PlaceValue2D />} />
          <Route path="/math/mixed-operations-20" element={<MixedOperationsDemo />} />
          <Route path="/math/chain-operations-20" element={<ChainOperationsDemo />} />
          <Route path="/math/make-ten-friends" element={<MakeTenFriendsDemo />} />
          <Route path="/math/word-problems" element={<WordProblemDemo />} />
          <Route path="/math/vertical-arithmetic" element={<VerticalArithmeticDemo />} />

          <Route
            path="/chemistry"
            element={
              <div className="main-container" style={{ textAlign: 'center' }}>
                <h2>化学模块开发中...</h2>
                <Link to="/" className="nav-btn">返回首页</Link>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
