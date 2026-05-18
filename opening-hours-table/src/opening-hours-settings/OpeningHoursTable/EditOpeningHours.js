/**
 * Import of backend
 */

import { GlobalContext, GlobalVars as GV } from '../backend';

import clsx from 'clsx';

import { 
    Button,
    Panel, 
    PanelBody, 
    PanelRow, 
    Modal, 
    Navigator,
    TextControl, 
    TimePicker,
    ToggleControl,
    useNavigator,
    SelectControl
} from '@wordpress/components';
import { 
    useState,
    useContext,
    useRef,
    RawHTML } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import GeneralSettings from './GeneralSettings';
import { TextWithFormat } from '../../text-with-format';

export default function EditOpeningHours( 
    { 
        times: times,
        infos: infos,
        locations: locations,
        contacts: contacts,
        currentLocation: currentLocation,
        LocationID: LocationID,
        LocationName: LocationName,
        editTimeById: editTimeById,
        deleteTimeById: deleteTimeById,
        editInfoById: editInfoById,
        deleteInfoById: deleteInfoById,
        editLocationById: editLocationById,
        deleteLocationById: deleteLocationById,
        create: create = false,
        createTime: createTime,
        createInfo: createInfo,
        createLocation: createLocation,
        editTime: editTime,
        editInfo: editInfo,
        editLocation: editLocation,
        editSettingById: editSettingById,
        editContact: editContact,
        ...props
    } 
) {
    props.className = clsx( props.className, "opening-hours-table-edit")

    const globalStates = useContext( GlobalContext );

    if ( create ) {
        return renderCreateNewLocation( createLocation );
    }

    /**
     * If data has not been initialized, return
     */

    if ( ! times, ! infos, ! locations, ! contacts ) return;

    const [ isEdit, setIsEdit ] = useState( {} );
    const [ isEditInfo, setIsEditInfo ] = useState( {} );
    const [ isEditLoc, setIsEditLoc ] = useState( false );
    let isNewStates = {};
    for ( let n = 1; n<8; n++ ) {
        if ( typeof isNewStates[n] === 'undefined' ) {
            isNewStates[n] = { newDay: {} };
        }
        isNewStates[n].newDay = useState( false );
    }
    const [ isNewInfo, setIsNewInfo ] = useState( false );
    const [ isNewLoc, setIsNewLoc ] = useState( create );
    let openStates = {};
    let closeStates = {};
    let infoStates = {};

    let _body = {
            timeBody: {},
            infoBody: {}
        };

    const nav = useNavigator();

    const DeleteModal = ( { ...props } ) => {

        const [ isOpen, setOpen ] = useState(false);
        const openModal = () => setOpen(true);
        const closeModal = () => setOpen(false);

        function handleDelete(props) {
            if ( props.isDeleteLoc ) {
                const newLocs = deleteLocationById( currentLocation.LocationID );
                nav.goTo( "/Edit" );
                globalStates.refreshOne( "locs", newLocs );
            }
            if ( typeof props.time !== 'undefined' ) {
                const newTimes = deleteTimeById( props.time.id );
                globalStates.refreshOne( "times", newTimes );
            }
            if ( typeof props.info !== 'undefined' ) {
                const newInfos = deleteInfoById( props.info.id );
                globalStates.refreshOne( "infos", newInfos );
            }
            closeModal();
        }

        return (
            <>
                <Button 
                    variant="primary" 
                    isDestructive 
                    onClick={ openModal } 
                    className={ clsx( props.className, "delete" ) }
                >
                    { __( "Delete", "wp_bepalmet_custom" ) }
                </Button>
                { isOpen && (
                    <Modal 
                        onRequestClose={ closeModal } 
                        title="Are you sure?"
                        className={ clsx( props.className, "modal" ) }
                    >
                        <Button 
                            variant="primary" 
                            isDestructive 
                            onClick={ () => handleDelete( props ) }
                            className={ clsx( props.className, "modal delete" ) }
                        >
                            { __( "Delete", "wp_bepalmet_custom" ) }
                        </Button>
                        <Button 
                            variant="secondary" 
                            onClick={ closeModal } 
                            className={ clsx( props.className, "modal abort" ) }
                        >
                            { __( "Abort", "wp_bepalmet_custom" ) }
                        </Button>
                    </Modal>
                ) }
            </>
        )
    }

    const Header = ( { ...props }) => {

        if ( props.isAll ) {
            return (
                <div className={ clsx( props.className, "wrap" ) }>
                    <h1 className={ clsx( props.className, "heading" ) }>{ __( "General settings", "wp_bepalmet_custom" ) }</h1>
                </div>
            )
        }

        function handleClickLocation() {
            setIsEditLoc( !isEditLoc );
        }
        
        const EditHeader = ( { ...props } ) => {

            const [ locName, setLocName ] = useState( currentLocation.LocationName );

            function saveClick() {
                const newLocs = editLocationById( currentLocation.LocationID, { newLocation: locName } );
                setIsNewLoc( false );
                nav.goTo( "/Edit/" + locName );
                globalStates.refreshAll( newLocs );
            }

            function abortClick() {
                handleClickLocation( props );
            }

            function handleLocChange( newLocName ) {
                setLocName( newLocName );
            }

            return (
                <>
                    <TextControl
                        __nextHasNoMarginBottom
                        __next40pxDefaultSize
                        value={ locName }
                        label={ __( "Name of the location", "wp_bepalmet_custom" ) }
                        onChange={ ( newLocName ) => handleLocChange( newLocName ) }
                    />
                    <Button onClick={ saveClick }>{ __( "Save", "wp_bepalmet_custom" ) }</Button>
                    <Button onClick={ abortClick }>{ __( "Abort", "wp_bepalmet_custom" ) }</Button>
                </>
            );

        }

        const FinalHeader = ( { ...props } ) => {
            if ( typeof isEditLoc === 'undefined' ) {
                isEditLoc = false;
            }
            if ( isEditLoc ) {
                return <EditHeader className={ clsx( props.className, "edit-header" ) } { ...props }/>
            }

            return (
                <>
                    <div
                        className={ clsx( props.className, "heading-wrap" ) }
                    >
                        <h1 
                            className={ clsx( props.className, "heading" ) }
                        >
                            { LocationName }
                        </h1>
                        { wpGlobalVars.sites && 
                            <h4 
                                className={ clsx( props.className, "site-heading" ) }
                            >
                                { __( "Site: ", "wp_bepalmet_custom" ) + wpGlobalVars.sites[currentLocation.site_id] ?? __( "Global", "wp_bepalmet_custom" ) }
                            </h4> 
                        }
                    </div>
                    <Button 
                        className={ clsx( props.className, "button-edit" ) }
                        onClick={ () => handleClickLocation(props) }
                    >
                        { __( "Edit name", "wp_bepalmet_custom" ) }
                    </Button>
                    <DeleteModal 
                        { ...props } 
                        isDeleteLoc 
                        className={ clsx( props.className, "button-delete" ) }
                    />
                </>
            )
        }

        return (
            <>
                <div 
                    className={ clsx( props.className, "header-wrap" ) }
                >
                    <FinalHeader className={ props.className }/>
                </div>
            </>
        );
    };

    const TimeBody = () => {

        function handleClick(props) {
            isEdit[props.time.id] = !isEdit[props.time.id];
            setIsEdit({
                ...isEdit
            });
        }

        function EditRow( { ...props } ) {

            openStates[props.time.id] = useState( GV.convertTime( props.time['open'] ) );
            closeStates[props.time.id] = useState( GV.convertTime( props.time['close'] ) );

            function saveClick() {
                const newOpen = GV.convertTime( openStates[props.time.id][0], true);
                const newClose = GV.convertTime( closeStates[props.time.id][0], true);
                const newTime = {
                    newOpen: newOpen, 
                    newClose: newClose
                }
                const newTimes = editTimeById( props.time.id, newTime );
                isNewStates[props.day].newDay[1](false);
                
                globalStates.screenData.setScreen( "/Edit/" + LocationName );
                globalStates.refreshOne( "times", newTimes );
            }

            function abortClick() {
                handleClick(props);
            }

            function handleOpenChange( newOpen ) {
                openStates[props.time.id][1](newOpen);
            }

            function handleCloseChange( newClose ) {
                closeStates[props.time.id][1](newClose);
            }

            return (
                <div
                    className={ clsx( props.className, "times edit-wrap" ) }
                >
                    <div
                        className={ clsx( props.className, "times edit time-picker" ) }
                    >
                        <TimePicker.TimeInput
                            value={ openStates[props.time.id][0] }
                            label={ __( "Open:", "wp_bepalmet_custom" ) }
                            onChange={ ( newOpen ) => handleOpenChange( newOpen ) }
                            className={ clsx( props.className, "times edit time-picker open" ) }
                        />
                        <TimePicker.TimeInput
                            value={ closeStates[props.time.id][0] }
                            label={ __( "Close:", "wp_bepalmet_custom" ) }
                            onChange={ ( newClose ) => handleCloseChange( newClose ) }
                            className={ clsx( props.className, "times edit time-picker closed" ) }
                        />
                    </div>
                    <Button 
                        onClick={ saveClick }
                        className={ clsx( props.className, "times edit save" ) }
                    >
                        { __( "Save", "wp_bepalmet_custom" ) }
                    </Button>
                    <Button 
                        onClick={ abortClick }
                        className={ clsx( props.className, "times edit abort" ) }
                    >
                        { __( "Abort", "wp_bepalmet_custom" ) }
                    </Button>
                </div>
            );

        }

        const NewTime = ( { ...props } ) => {

            function saveNew( _newOpen, _newClose ) {
                const newTimes = createTime({
                    LocationID: parseInt( LocationID ),
                    LocationName: LocationName,
                    weekday: parseInt(props.day),
                    open: GV.convertTime( _newOpen, true ),
                    close: GV.convertTime( _newClose, true)
                });
                isNewStates[props.day].newDay[1]( false );

                globalStates.screenData.setScreen( "/Edit/" + LocationName );
                globalStates.refreshOne( "times", newTimes );
            }

            if ( isNewStates[props.day].newDay[0] ) {

                const [ newOpen, setNewOpen ] = useState( {hours: "00", minutes: "00"} );
                const [ newClose, setNewClose ] = useState( {hours: "00", minutes: "00"} );

                return (
                    <div
                        className={ clsx( props.className, "times new-wrap" ) }
                    >
                        <div
                            className={ clsx( props.className, "times new time-picker" ) }
                        >
                            <TimePicker.TimeInput
                                value={ newOpen }
                                label="Open:"
                                onChange={ ( _newOpen ) => setNewOpen( _newOpen ) }
                                className={ clsx( props.className, "times new time-picker open" ) }
                            />
                            <TimePicker.TimeInput
                                value={ newClose }
                                label="Close:"
                                onChange={ ( _newClose ) => setNewClose( _newClose ) }
                                className={ clsx( props.className, "times new time-picker closed" ) }
                            />
                        </div>
                        <Button 
                            onClick={ () => saveNew( newOpen, newClose ) }
                            className={ clsx( props.className, "times new save" ) }
                        >
                            { __( "Save", "wp_bepalmet_custom" ) }
                            </Button>
                        <Button 
                            onClick={ () => isNewStates[props.day].newDay[1]( false ) }
                            className={ clsx( props.className, "times new abort" ) }
                        >
                            { __( "Abort", "wp_bepalmet_custom" ) }
                        </Button>
                    </div>
                );
            } else {
                return;
            }
        };

        const Row = ( { ...props } ) => {

            if ( typeof isEdit[props.time.id] === 'undefined' ) {
                isEdit[props.time.id] = false;
            }
            
            if ( isEdit[props.time.id] ) {
                return <PanelRow><EditRow { ...props }/></PanelRow>;
            }

            const open = props.time['open'].substring(0, props.time['open'].length - 3);
            const close = props.time['close'].substring(0, props.time['close'].length - 3);

            return (
                <PanelRow>
                    <div
                        className={ clsx( props.className, "times one-time" ) }
                    >
                        { open } - { close }
                    </div>
                    <Button 
                        onClick={ () => handleClick(props) }
                        className={ clsx( props.className, "times edit" ) }
                    >
                        { __( "Edit", "wp_bepalmet_custom" ) }
                    </Button>
                    <DeleteModal { ...props }/>
                </PanelRow>
            )
        };

        const Weekday = ( { ...props } ) => (
            <Panel>
                <PanelBody 
                    title={ __( GV.weekdays(props.day), "wp_bepalmet_custom" ) } 
                    initialOpen={ typeof props.rows !== 'undefined' || isNewStates[props.day].newDay[0] }
                >
                    <Button 
                        onClick={ () => isNewStates[props.day].newDay[1]( true ) }
                        className={ clsx( props.className, "times new" ) }
                    >
                        { __( "Add time", "wp_bepalmet_custom" ) }
                    </Button>
                    <NewTime
                        { ...props }
                    />
                    <div
                        className={ clsx( props.className, "times panel body" ) }
                    >
                        { props.rows }
                    </div>
                </PanelBody>
            </Panel>
        );

        const locData = times[LocationName];

        if ( typeof locData !== 'undefined' ) {
            if ( typeof locData['weekdays'] !== 'undefined' ) {   
                for ( const [ weekday, openings ] of Object.entries( locData['weekdays'] ) ) {
                    _body[weekday] = {
                        rows: {}
                    };
                    for ( const time of openings ) {
                        _body[weekday]['rows'][time.id] = (
                            <Row 
                                time={ time } 
                                day={ weekday } 
                                { ...props }
                            />
                        );
                    }
                    _body['timeBody'][weekday] = (
                        <Weekday 
                            day={ weekday } 
                            rows={ Object.values( _body[weekday]['rows'] ) }
                            { ...props }
                        />
                        );
                }
            }
        }
        for ( let n = 1; n<8; n++ ) {
            if ( typeof _body['timeBody'][n] === 'undefined' ) {
                _body['timeBody'][n] = (<Weekday day={ n }/>);
            }
        }
        return Object.values( _body['timeBody'] );
        
    }

    const InfoBody = () => {

        function handleClickInfo(props) {
            isEditInfo[props.info.id] = !isEditInfo[props.info.id];
            setIsEditInfo({
                ...isEditInfo
            });
        }

        function EditInfoRow( { ...props } ) {

            infoStates[props.info.id] = useState( props.info['info'] );
            const blockRef = useRef( infoStates[props.info.id][0] );

            function saveClick() {
                if ( ! blockRef.current.attributes ) {
                    handleClickInfo(props);
                    return;
                }
                const newInfo = {
                    newInfo: blockRef.current.attributes.content
                }
                const newInfos = editInfoById( props.info.id, newInfo );

                globalStates.screenData.setScreen( "/Edit/" + LocationName );
                globalStates.refreshOne( "infos", newInfos );
            }

            function abortClick() {
                handleClickInfo(props);
            }

            return (
                <div
                    className={ clsx( props.className, "info edit-wrap" ) }
                >
                    <TextWithFormat
                        value={ infoStates[props.info.id][0] }
                        blockRef={ blockRef }
                    />
                    <Button onClick={ saveClick }>{ __( "Save", "wp_bepalmet_custom" ) }</Button>
                    <Button onClick={ abortClick }>{ __( "Abort", "wp_bepalmet_custom" ) }</Button>
                </div>
            );

        }

        const NewInfo = ( { ...props } ) => {
            
            const blockRef = useRef( '' );

            function saveNewInfo() {
                if ( ! blockRef.current.attributes ) {
                    setIsNewInfo( false );
                    return;
                }
                const newInfos = createInfo({
                    LocationID: parseInt( LocationID ),
                    LocationName: LocationName,
                    info: blockRef.current.attributes.content
                });
                setIsNewInfo( false );

                globalStates.refreshOne( "infos", newInfos );
            }

            if ( isNewInfo ) {

                return (
                    <div
                        className={ clsx( props.className, "info new-wrap" ) }
                    >
                        <TextWithFormat 
                            value={ '' }
                            blockRef={ blockRef }
                        />
                        <Button onClick={ saveNewInfo }>{ __( "Save", "wp_bepalmet_custom" ) }</Button>
                        <Button onClick={ () => setIsNewInfo( false ) }>{ __( "Abort", "wp_bepalmet_custom" ) }</Button>
                    </div>
                )

            }

        }

        const InfoRow = ( { ...props } ) => {
            if ( typeof isEditInfo[props.info.id] === 'undefined' ) {
                isEditInfo[props.info.id] = false;
            }
            
            if ( isEditInfo[props.info.id] ) {
                return <EditInfoRow { ...props }/>;
            }

            return (
                <PanelRow>
                    <RawHTML
                        className={ clsx( props.className, "info one-info" ) }
                    >
                        { props.info.info }
                    </RawHTML>
                    <Button 
                        onClick={ () => handleClickInfo(props) }
                        className={ clsx( props.className, "info edit" ) }
                    >
                        { __( "Edit", "wp_bepalmet_custom" ) }
                    </Button>
                    <DeleteModal 
                        { ...props }
                        className={ clsx( props.className, "info delete" ) }
                    />
                </PanelRow>
            )
        };

        let locData = infos[LocationName];
        if ( typeof locData === 'undefined' ) {
            locData = {};
        }

        for ( const infoObj of Object.values( locData ) ) {
            _body['infoBody'][infoObj.id] = <InfoRow { ...props } info={ infoObj } />;
        }

        return (
            <>
                <div
                    className={ clsx( props.className, "panel info body" ) }
                >
                    { Object.values( _body['infoBody'] ) }
                </div>
                <Button 
                    onClick={ () => setIsNewInfo( true ) }
                    className={ clsx( props.className, "info new" ) }
                >
                    { __( "Add info", "wp_bepalmet_custom" ) }
                </Button>
                <NewInfo/>
            </>
        )
    }


    const ContactBody = () => {

        const { active: phoneActive, value: phoneValue } = contacts[LocationName].phone;
        const { active: faxActive, value: faxValue } = contacts[LocationName].fax;
        const { active: mailActive, value: mailValue } = contacts[LocationName].mail;
        const { active: addressActive, value: addressValue } = contacts[LocationName].address;
        
        const [ tempPhone, setTempPhone ] = useState( phoneValue );
        const [ tempFax, setTempFax ] = useState( faxValue );
        const [ tempMail, setTempMail ] = useState( mailValue );
        const [ tempAddress, setTempAddress ] = useState( addressValue );

        const [ editPhone, setEditPhone ] = useState( false );
        const [ editFax, setEditFax ] = useState( false );
        const [ editMail, setEditMail ] = useState( false );
        const [ editAddress, setEditAddress ] = useState( false );

        function handleChange( state, label ) {
            const newContacts = editContact( {
                LocationID: parseInt( LocationID ),
                LocationName: LocationName,
                contact_active: state,
                contact_label: label
            } );
            globalStates.refreshOne( "contacts", newContacts );
        }

        function handleSaveText( label, newValue ) {
            const newContacts = editContact( {
                LocationID: parseInt( LocationID ),
                LocationName: LocationName,
                contact_label: label,
                contact_value: newValue
            } );
            globalStates.refreshOne( "contacts", newContacts );
        }
        
        return (
            <>
                <PanelRow
                    className={ clsx( props.className, "panel contacts row phone" ) }
                >
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( "phone", "wp_bepalmet_custom" ) }
                        checked={ phoneActive }
                        onChange={ (state) => handleChange( state, "phone" ) }
                    />
                    { !! editPhone && 
                        <>
                            <TextControl
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                                label={ __( "Phone Number", "wp_bepalmet_custom" ) }
                                value={ tempPhone }
                                onChange={ ( newValue ) => setTempPhone( newValue) }
                            />
                            <Button
                                variant='primary'
                                onClick={ () => handleSaveText( "phone", tempPhone ) }
                            >
                                { __( "Save", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                    { ! editPhone &&
                        <>
                            <div
                                className={ clsx( props.className, "contact value phone", phoneActive?"active":"inactive" ) }
                            >
                                { phoneValue }
                            </div>
                            <Button
                                variant='primary'
                                onClick={ () => setEditPhone( ( true ) ) }
                            >
                                { __( "Edit", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                </PanelRow>
                <PanelRow
                    className={ clsx( props.className, "panel contacts row fax" ) }
                >
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( "fax", "wp_bepalmet_custom" ) }
                        checked={ faxActive }
                        onChange={ (state) => handleChange( state, "fax" ) }
                    />
                    { !! editFax &&
                        <>
                            <TextControl
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                                label={ __( "Fax Number", "wp_bepalmet_custom" ) }
                                value={ tempFax }
                                onChange={ ( newValue ) => setTempFax( newValue ) }
                            />
                            <Button
                                variant='primary'
                                onClick={ () => handleSaveText( "fax", tempFax ) }
                            >
                                { __( "Save", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                    { ! editFax &&
                        <>
                            <div
                                className={ clsx( props.className, "contact value fax", faxActive?"active":"inactive" ) }
                            >
                                { faxValue }
                            </div>
                            <Button
                                variant='primary'
                                onClick={ () => setEditFax( ( true ) ) }
                            >
                                { __( "Edit", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                </PanelRow>
                <PanelRow
                    className={ clsx( props.className, "panel contacts row mail" ) }
                >
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( "mail", "wp_bepalmet_custom" ) }
                        checked={ mailActive }
                        onChange={ (state) => handleChange( state, "mail" ) }
                    />
                    { !! editMail &&
                        <>
                            <TextControl
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                                label={ __( "E-Mail address", "wp_bepalmet_custom" ) }
                                value={ tempMail }
                                onChange={ ( newValue ) => setTempMail( newValue) }
                            />
                            <Button
                                variant='primary'
                                onClick={ () => handleSaveText( "mail", tempMail ) }
                            >
                                { __( "Save", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                    { ! editMail &&
                        <>
                            <div
                                className={ clsx( props.className, "contact value mail", mailActive?"active":"inactive" ) }
                            >
                                { mailValue }
                            </div>
                            <Button
                                variant='primary'
                                onClick={ () => setEditMail( ( true ) ) }
                            >
                                { __( "Edit", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                </PanelRow>
                <PanelRow
                    className={ clsx( props.className, "panel contacts row address" ) }
                >
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={ __( "address", "wp_bepalmet_custom" ) }
                        checked={ addressActive }
                        onChange={ (state) => handleChange( state, "address" ) }
                    />
                    { !! editAddress &&
                        <>
                            <TextControl
                                __nextHasNoMarginBottom
                                __next40pxDefaultSize
                                label={ __( "Address", "wp_bepalmet_custom" ) }
                                value={ tempAddress }
                                onChange={ ( newValue ) => setTempAddress( newValue) }
                            />
                            <Button
                                variant='primary'
                                onClick={ () => handleSaveText( "address", tempAddress ) }
                            >
                                { __( "Save", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                    { ! editAddress &&
                        <>
                            <div
                                className={ clsx( props.className, "contact value address", addressActive?"active":"inactive" ) }
                            >
                                { addressValue }
                            </div>
                            <Button
                                variant='primary'
                                onClick={ () => setEditAddress( ( true ) ) }
                            >
                                { __( "Edit", "wp_bepalmet_custom" ) }
                            </Button>
                        </>
                    }
                </PanelRow>
            </>
        )
    }

    if ( currentLocation.LocationName === "all" ) {
        return (<>
            <Header 
                className={ clsx( props.className, "header" ) } 
                isAll
            />
            <Panel>
                <PanelBody 
                    title={ __( "General info", "wp_bepalmet_custom" ) }
                >
                    <InfoBody/>
                </PanelBody>
            </Panel>
            <GeneralSettings
                { ...props }
                editSettingById={ editSettingById }
            />
        </>);
    }

    return (
        <>
            <Header className={ clsx( props.className, "header" ) }/>
            <Panel>
                <PanelBody 
                    title={ __( "Days of week", "wp_bepalmet_custom" ) }
                    className={ clsx( props.className, "panel times" ) }
                >
                    <TimeBody/>
                </PanelBody>
            </Panel>
            <Panel>
                <PanelBody 
                    title={ __( "Additional info", "wp_bepalmet_custom" ) }
                    className={ clsx( props.className, "panel info" ) }
                >
                    <InfoBody/>
                </PanelBody>
            </Panel>
            <Panel>
                <PanelBody 
                    title= { __( "Contact information", "wp_bepalmet_custom" ) } 
                    className={ clsx( props.className, "panel contacts" ) }
                >
                    <ContactBody/>
                </PanelBody>
            </Panel>
        </>
    );
        
    function renderCreateNewLocation( createLocation ) {

        const nav = useNavigator();

        const [ newLocText, setNewLocText ] = useState();

        const sites = [ {
            value: 0,
            label: 'Global'
        } ];
        for ( let [ siteId, siteName ] of Object.entries( wpGlobalVars.sites ) ) {
            sites.push( {
                value: siteId,
                label: siteName
            } );
        }
        const [ selectedSite, setSelectedSite ] = useState( 0 );

        function handleButton() {
            const site_id = selectedSite === 0 ? null : selectedSite;
            const newLocs = createLocation( {
                LocationName: newLocText,
                site_id: site_id
            } );

            nav.goTo( "/Edit" );
            globalStates.refreshOne( [ "contacts", "locs" ], newLocs );
        }

        function changeSelection( newSite ) {
            setSelectedSite( newSite );
        }

        const SiteSelectDropdown = () => {
            
            return(
                <SelectControl
                    __next40pxDefaultSize
                    __nextHasNoMarginBottom
                    label='Select site to add location to'
                    value={ selectedSite }
                    options={ sites }
                    onChange={ changeSelection }
                />
            );
        }

        return (
        <>
            <Navigator.BackButton>
                { __( "Back", "wp_bepalmet_custom" ) }
            </Navigator.BackButton>
            <TextControl
                __nextHasNoMarginBottom
                __next40pxDefaultSize
                label={ __( "Enter name of new location to add:", "wp_bepalmet_custom" ) }
                value={ newLocText }
                onChange={ ( newText ) => setNewLocText( newText ) }
            />
            { wpGlobalVars.sites && globalStates.hasEditorCapability && <SiteSelectDropdown/> }
            <Button
                onClick={ handleButton }
                type='submit'
            >
                { __( "Save", "wp_bepalmet_custom" ) }
            </Button>
        </>
        );
    }
}