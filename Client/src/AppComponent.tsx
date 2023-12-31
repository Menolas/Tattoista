import * as React from "react"
import {useEffect, useState} from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {useDispatch, Provider} from 'react-redux'
import { compose } from 'redux'
import { Route, Routes, HashRouter, BrowserRouter } from "react-router-dom"
import { store } from "./redux/redux-store"
import { withRouter } from "./hoc/withRouter"
import './assets/scss/style.css'
import { SmoothScroll } from "./utils/smoothScroll"
import { HeaderContainer } from "./components/Header/HeaderContainer"
import { MainPageContainer } from "./pages/mainPage/MainPageContainer"
import { Contacts } from "./components/Contacts"
import { Footer } from "./components/Footer/Footer"
import Admin from "./pages/admin/Admin"
import { BookedConsultationsContainer} from "./components/Admin/bookedConsultations/BookedConsultationsContainer"
import { ClientsContainer } from "./components/Admin/Clients/ClientsContainer"
import { ProfileContainer } from "./components/Admin/ClientProfile/ProfileContainer"
import { LoginContainer } from "./pages/login/LoginContainer"
import { PortfolioContainer } from "./pages/portfolio/PortfolioContainer"
import { Preloader } from "./components/common/Preloader"
import { ArchiveContainer } from "./components/Admin/Archive/ArchiveContainer"
import { ArchivedClients } from "./components/Admin/Archive/ArchivedClients"
import { ArchivedConsultations } from "./components/Admin/Archive/ArchivedConsultations"
import {ArchivedGallery} from "./components/Admin/Archive/ArchivedGallery"
import {RegistrationContainer} from "./pages/registration/RegistrationContainer"
import {checkAuth} from "./redux/Auth/auth-reducer"
import {ScrollToTopButton} from "./components/common/ScrollToTopButton"
import {UsersContainer} from "./components/Admin/Users/UsersContainer"
import {NotFound} from "./components/404-page";

const App = () => {

    //const navigate = useNavigate()
    const location = useLocation()

    const [scrollTop, setScrollTop] = useState(0)

    const dispatch = useDispatch()

    useEffect( () => {
        //console.log('URL changed:', location.pathname);
        dispatch(checkAuth())

    }, [location.pathname])

    // const handleScroll = event => {
    //     console.log("SCROLL!!")
    //     setScrollTop(event.currentTarget.scrollTop)
    // }

    return (
        <div
            className={scrollTop !== 0 ? "app fixed" : "app"}
            // onScroll={(e) => {
            //     handleScroll(e)
            // }}
        >
            <SmoothScroll>
                <React.Suspense fallback={<Preloader />}>
                    <HeaderContainer />
                    <main className={"site-main container"}>
                        <Routes>
                            <Route path='/'
                                   element={<MainPageContainer />} />
                            <Route path={`registration`}
                                   element={<RegistrationContainer />} />
                            <Route path={`login`}
                                   element={<LoginContainer />} />
                            <Route path={`portfolio`}
                                   element={<PortfolioContainer />} />
                            <Route path={`admin`}
                                   element={<Admin />}>
                                <Route path={`bookedConsultations`}
                                       element={<BookedConsultationsContainer />} />
                                <Route path={`clients`}
                                       element={<ClientsContainer />} />
                                <Route path={`profile`}
                                       element={<ProfileContainer />} />
                                <Route path={`portfolio`}
                                       element={<PortfolioContainer />} />
                                <Route path={`archive`}
                                       element={<ArchiveContainer />}>
                                    <Route path={`archivedClients`}
                                           element={<ArchivedClients />}/>
                                    <Route path={`archivedConsultations`}
                                           element={<ArchivedConsultations />}/>
                                    <Route path={`archivedGallery`}
                                           element={<ArchivedGallery />}/>
                                </Route>
                                <Route path={`users`}
                                       element={<UsersContainer/>} />
                            </Route>
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                    <Contacts />
                    <ScrollToTopButton/>
                    <Footer />
                </React.Suspense>
            </SmoothScroll>
        </div>
    )
}

const AppContainer = compose(withRouter)(App)

export const AhTattooistaApp = () => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Provider store={store}>
                <AppContainer />
            </Provider>
        </BrowserRouter>
    )
}
