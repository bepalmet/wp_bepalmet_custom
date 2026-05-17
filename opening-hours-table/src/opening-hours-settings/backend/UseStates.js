/**
 * react dependencies
 */
import { 
    useState,
    createContext,
    useRef
} from "react";
import { unstable_batchedUpdates } from 'react-dom';

/**
 * Local dependencies
 */
import RESTHandler from "./RESTHandler";
import { useEffect, useMemo } from "react";

/**
 * create the Global Context
 */

const GlobalContext = createContext(null);

class Optimizer {

    constructor() {
        [ this.times, this.setTimes ] = useState();
        [ this.infos, this.setInfos ] = useState();
        [ this.locs, this.setLocs ] = useState();
        [ this.settings, this.setSettings ] = useState();
        [ this.contacts, this.setContacts ] = useState();
    }

    gettimes() { return [ this.times, this.setTimes ]; }
    getinfos() { return [ this.infos, this.setInfos ]; }
    getlocs() { return [ this.locs, this.setLocs ]; }
    getsettings() { return [ this.settings, this.setSettings ]; }
    getcontacts() { return [ this.contacts, this.setContacts ]; }

}

/**
 * 
 * @param {React.Component} children 
 * @returns React component with Global Context for useStates
 */

const GCProvider = ( { children: children, setIsLoading: setIsLoading } ) => {

    /**
     * Define all useStates used in ohsettings here
     */

    const optimizer = new Optimizer();

    const [ _times, setTimes ] = optimizer.gettimes();
    const [ _infos, setInfos ] = optimizer.getinfos();
    const [ _locs, setLocs ] = optimizer.getlocs();
    const [ _settings, setSettings ] = optimizer.getsettings();
    const [ _contacts, setContacts ] = optimizer.getcontacts();

    const times = useMemo( () => _times, [_times] );
    const infos = useMemo( () => _infos, [_infos] );
    const locs = useMemo( () => _locs, [_locs] );
    const settings = useMemo( () => _settings, [_settings] );
    const contacts = useMemo( () => _contacts, [_contacts] );

    const [ hasEditorCapability, setHasEditorCapability ] = useState( false );

    let showAllRef = useRef( false );
    let showAllLocs = showAllRef.current;
    function setShowAllLocs( newValue ) {
        let storage = showAllLocs;
        if ( typeof newValue === 'function' ) {
            storage = newValue( storage );
        } else {
            storage = newValue;
        }
        showAllRef.current = storage;
    }
                    

    // Load initial data
    useEffect( () => {
        setIsLoading( true );
        const loadInitialData = async () => {
            try {
                const [ capabilityData, timesData, infosData, locsData, settingsData, contactsData] = await Promise.all([

                    RESTHandler.getCapability( 'edit_pages' ),
                    RESTHandler.getTimes( ! showAllRef.current),
                    RESTHandler.getInfos( ! showAllRef.current),
                    RESTHandler.getLocations( ! showAllRef.current),
                    RESTHandler.getSettings( ! showAllRef.current),
                    RESTHandler.getContacts( ! showAllRef.current)
                ]);
                
                unstable_batchedUpdates( () => {
                    setTimes(timesData);
                    setInfos(infosData);
                    setLocs(locsData);
                    setSettings(settingsData);
                    setContacts(contactsData);
                    setIsLoading(false);
                    setHasEditorCapability(capabilityData);
                });
            } catch (error) {
                console.error('Failed to load initial data:', error);
                setIsLoading( false );
            }
        };
        loadInitialData();
    }, []);

    let screen = useRef('/');
    function setScreen( newScreen ) {
        screen.current = newScreen;
    }

    const globalStates = {
        screenData: {
            screen: screen.current,
            setScreen: setScreen
        },
        timeData: {
            times: times,
            setTimes: setTimes
            },
        infoData: {
            infos: infos,
            setInfos: setInfos
        },
        locData: {
            locs: locs,
            setLocs: setLocs
        },
        settingData: {
            settings: settings,
            setSettings: setSettings
        },
        contactData: {
            contacts: contacts,
            setContacts: setContacts
        },
        refreshAll: ( waitFor ) => {
            setIsLoading( true );
            const loadData = async () => {
                await waitFor;
                try {
                    const [timesData, infosData, locsData, settingsData, contactsData] = await Promise.all([
                        RESTHandler.getTimes( ! showAllRef.current),
                        RESTHandler.getInfos( ! showAllRef.current),
                        RESTHandler.getLocations( ! showAllRef.current),
                        RESTHandler.getSettings( ! showAllRef.current),
                        RESTHandler.getContacts( ! showAllRef.current)
                    ]); 
                    
                    unstable_batchedUpdates( () => {
                        setTimes(timesData);
                        setInfos(infosData);
                        setLocs(locsData);
                        setSettings(settingsData);
                        setContacts(contactsData);
                        setIsLoading(false);
                    });
                } catch (error) {
                    console.error('Failed to refresh data:', error);
                    setIsLoading( false );
                }
            };
            loadData();
        },
        refreshOne: ( toRefresh, waitFor ) => {
            setIsLoading(true);
            if ( ! Array.isArray( toRefresh ) ){
                toRefresh = [ toRefresh ];
            }
            if ( ! Array.isArray( waitFor ) ){
                waitFor = [ waitFor ];
            }
            let data = [];
            const loadData = async () => {
                try {
                    for ( let oneWaitFor of waitFor ){
                        await oneWaitFor;
                    }
                    for ( let oneRefresh of toRefresh ){
                        switch( oneRefresh ) {
                            case "times":
                                data.push( [ await RESTHandler.getTimes( ! showAllRef.current ), setTimes ] );
                                break;
                            case "infos":
                                data.push( [ await RESTHandler.getInfos( ! showAllRef.current ), setInfos ] );
                                break;
                            case "locs":
                                data.push( [ await RESTHandler.getLocations( ! showAllRef.current ), setLocs ] );
                                break;
                            case "settings":
                                data.push( [ await RESTHandler.getSettings( ! showAllRef.current ), setSettings ] );
                                break;
                            case "contacts":
                                data.push( [ await RESTHandler.getContacts( ! showAllRef.current ), setContacts ] );
                                break;
                            default:
                                throw new Error( "Refreshing " + oneRefresh + " is not possible" );
                        }
                    }
                    unstable_batchedUpdates( () => {
                        for ( let oneData of data ){
                            oneData[1]( oneData[0] );
                        }
                        setIsLoading(false);
                    } );
                } catch (error) {
                    console.error('Failed to refresh data:', error);
                    setIsLoading(false);
                }
            };
            loadData();
        },
        hasEditorCapability: hasEditorCapability,
        showAllLocs: {
            state: showAllLocs,
            set: setShowAllLocs
        }
    };

    return (
        <div
            className={ "bepalmet-custom-settings" }
        >
            <GlobalContext.Provider value={ globalStates }>
                { children }
            </GlobalContext.Provider>
        </div>
    );
}

export { GlobalContext };
export { GCProvider };