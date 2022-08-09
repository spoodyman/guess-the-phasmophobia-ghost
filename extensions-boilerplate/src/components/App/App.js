import React from 'react'
import Authentication from '../../util/Authentication/Authentication'

import './App.css'

class Ghost {
    id = '';
    evidences = [];
    striped = false;
    name = '';

    constructor(id, name, evidences) {
        this.id = id;
        this.name = name;
        this.evidences = evidences;
    }

    select() {
        if (this.selected) {
            this.selected = false;
            this.striped = true;
            return;
        }

        if (this.striped) {
            this.striped = false;
            return;
        }

        this.selected = true;
    }

    hasEvidences(evidences) {
        if (!evidences.length) {
            return true;
        }

        const hasEvidenceList = evidences.map((evidence) => this.evidences.includes(evidence));
        return !hasEvidenceList.includes(false);
    }
}

export default class App extends React.Component{
    evidenceText = {
        emf5: 'EMF Level 5',
        fingerprints: 'Fingerprints',
        writing: 'Ghost writing',
        freeze: 'Freezing',
        dots: 'D.O.T.S.',
        orbs: 'Ghost orbs',
        radio: 'Spirit box'
    }

    leftEvidences = ['emf5', 'fingerprints', 'writing', 'freeze'];
    rightEvidences = ['dots', 'orbs', 'radio'];

    ghostsLists = [
        [
            new Ghost('spirit', 'Spirit', ['emf5', 'radio', 'writing']),
            new Ghost('poltergeist', 'Poltergeist', ['radio', 'fingerprints', 'writing']),
            new Ghost('mare', 'Mare', ['radio', 'orbs', 'writing']),
            new Ghost('demon', 'Demon', ['fingerprints', 'writing', 'freeze']),
            new Ghost('yokai', 'Yokai', ['radio', 'orbs', 'dots']),
            new Ghost('myling', 'Myling', ['emf5', 'fingerprints', 'writing']),
            new Ghost('raiju', 'Raiju', ['emf5', 'orbs', 'dots']),
            new Ghost('moroi', 'Moroi', ['radio', 'writing', 'freeze']),
        ],
        [
            new Ghost('wraith', 'Wraith', ['emf5', 'radio', 'dots']),
            new Ghost('banshee', 'Banshee', ['fingerprints', 'orbs', 'dots']),
            new Ghost('revenant', 'Revenant', ['orbs', 'writing', 'freeze']),
            new Ghost('yurei', 'Yurei', ['orbs', 'freeze', 'dots']),
            new Ghost('hantu', 'Hantu', ['fingerprints', 'orbs', 'freeze']),
            new Ghost('onryo', 'Onryo', ['radio', 'orbs', 'freeze']),
            new Ghost('obake', 'Obake', ['emf5', 'fingerprints', 'orbs']),
            new Ghost('deogen', 'Deogen', ['radio', 'writing', 'dots']),
        ],
        [
            new Ghost('phantom', 'Phantom', ['radio', 'fingerprints', 'dots']),
            new Ghost('jinn', 'Jinn', ['emf5', 'fingerprints', 'freeze']),
            new Ghost('shade', 'Shade', ['emf5', 'writing', 'freeze']),
            new Ghost('oni', 'Oni', ['emf5', 'freeze', 'dots']),
            new Ghost('goryo', 'Goryo', ['emf5', 'fingerprints', 'dots']),
            new Ghost('twins', 'The Twins', ['emf5', 'radio', 'freeze']),
            new Ghost('mimic', 'The Mimic', ['radio', 'fingerprints', 'freeze']),
            new Ghost('thaye', 'Thaye', ['orbs', 'writing', 'dots']),
        ]
    ];

    constructor(props){
        super(props)
        this.Authentication = new Authentication()

        //if the extension is running on twitch or dev rig, set the shorthand here. otherwise, set to null. 
        this.twitch = window.Twitch ? window.Twitch.ext : null
        this.state= {
            finishedLoading:false,
            isVisible:true,
            ghost: '',
            evidence: {
                emf5: false,
                fingerprints: false,
                writing: false,
                freeze: false,
                dots: false,
                orbs: false,
                radio: false
            }
        }
    }

    contextUpdate(context, delta){
        if (delta.includes('theme')){
            this.setState(()=> ({ theme:context.theme }));
        }
    }

    visibilityChanged(isVisible){
        this.setState(()=> ({ isVisible }));
    }

    componentDidMount(){
        if(this.twitch){
            this.twitch.onAuthorized((auth)=>{
                this.Authentication.setToken(auth.token, auth.userId)
                if(!this.state.finishedLoading){
                    // if the component hasn't finished loading (as in we've not set up after getting a token), let's set it up now.

                    // now we've done the setup for the component, let's set the state to true to force a rerender with the correct data.
                    this.setState(()=>{
                        return {finishedLoading:true}
                    })
                }
            })

            this.twitch.listen('broadcast',(target,contentType,body)=>{
                this.twitch.rig.log(`New PubSub message!\n${target}\n${contentType}\n${body}`)
                // now that you've got a listener, do something with the result... 

                // do something...

            })

            this.twitch.onVisibilityChanged((isVisible,_c)=>{
                this.visibilityChanged(isVisible)
            })

            this.twitch.onContext((context,delta)=>{
                this.contextUpdate(context,delta)
            })
        }
    }

    componentWillUnmount(){
        if(this.twitch){
            this.twitch.unlisten('broadcast', ()=>console.log('successfully unlistened'))
        }
    }

    setGhost(ghost) {
        if (ghost.striped) {
            ghost.striped = false;

            this.setState((_)=> _);
            return;
        }

        if (this.state.ghost.id === ghost.id) {
            ghost.striped = true;
            this.setState(()=> ({ ghost: {} }));
        } else {
            ghost.striped = false;
            this.setState(()=> ({ ghost: ghost}));
        }
    }

    toggleEvidence(evidenceKey) {
        const newValue = !this.state.evidence[evidenceKey];
        this.setState(()=>({
            evidence: {
                ...this.state.evidence,
                [evidenceKey]: newValue
            }
        }));
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }   
    
    render(){
        if(this.state.finishedLoading && this.state.isVisible){
            return (
                <div className="App">
                    <div className={this.state.theme === 'light' ? 'App-light' : 'App-dark'} >
                        <p>Hello</p>
                        {/* <p>Hello world!</p>
                        <p>My token is: {this.Authentication.state.token}</p>
                        <p>My opaque ID is {this.Authentication.getOpaqueId()}.</p>
                        <div>{this.Authentication.isModerator() ? <p>I am currently a mod, and here's a special mod button <input value='mod button' type='button'/></p>  : 'I am currently not a mod.'}</div>
                        <p>I have {this.Authentication.hasSharedId() ? `shared my ID, and my user_id is ${this.Authentication.getUserId()}` : 'not shared my ID'}.</p> */}
                    </div>
                </div>
            )
        } else{
            return (
                <div className="App">
                    <div className="App-content">
                        <h4>Evidence</h4>
                        <hr style={{ marginBottom: '16px' }} />
                        <div className="flex justify-around">
                            <div className="flex flex-col space-y">
                                {this.leftEvidences.map((evidence) =>
                                    <label key={evidence}>
                                        {this.evidenceText[evidence]}
                                        <input onChange={() => this.toggleEvidence(evidence)} type="checkbox" id={evidence} name={evidence} />
                                        <span className="checkmark"></span>
                                    </label>
                                )}
                            </div>

                            <div className="flex flex-col space-y" style={{ marginLeft: '16px' }}>
                                {this.rightEvidences.map((evidence) => 
                                    <label key={evidence}>
                                        {this.evidenceText[evidence]}
                                        <input onChange={() => this.toggleEvidence(evidence)} type="checkbox" id={evidence} name={evidence} />
                                        <span className="checkmark"></span>
                                    </label>
                                )}
                            </div>
                        </div>
                        <hr style={{ marginTop: '16px' }} />
                        <h4 className="text-center">Using the evidence we've found, we believe the ghost is a:</h4>
                        <div className="flex justify-between">
                            {this.ghostsLists.map(((ghostsList, index) => 
                                <div key={`ghost-list-${index}`} className="flex flex-col space-y">
                                    {ghostsList.map((ghost) => 
                                        <button style={{
                                            borderColor: this.state.ghost.id === ghost.id ? 'black' : '#d1cfad',
                                            color: ghost.hasEvidences(Object.entries(this.state.evidence).filter(([_key, value]) => value).map(([key, _value]) => key)) ? 'green' : 'red',
                                            textDecoration: ghost.striped ? 'line-through' : 'auto'
                                        }} key={ghost.id} onClick={() => this.setGhost(ghost)}>{ghost.name}</button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {/* <h4 className="text-center">Using the evidence we've found, we believe the ghost is a:</h4>
                        <div className="discovery-container">
                            <h2 className="text-center">{this.capitalizeFirstLetter(this.state.ghost) || 'Not yet discovered'}</h2>
                        </div> */}
                    </div>
                </div>
            )
        }

    }
}