
import {BrowserRouter,Route, Routes} from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';

import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import CreateOrEditBlog from './pages/createBlog';


function App() {
  

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp/>}  />
        <Route path="/signin" element={<SignIn/>}  />
        <Route path="/blog/:id" element={<BlogDetail  />}  />
        <Route path="/write" element={<CreateOrEditBlog />} />       {/* ✅ Create */}
        <Route path="/write/:id" element={<CreateOrEditBlog />} /> 
        <Route path="/blogs" element={<Blogs/>}  />
      </Routes>
    
    </BrowserRouter>
      
    </>
  )
}

export default App
