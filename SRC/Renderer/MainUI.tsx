import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as fs from 'fs'
import * as ps from 'child_process'
import { MapShow } from './MapShow'
import { EchartShowSys } from './EchartsShow'
import { NetServerMain } from './SocketComu'

export module MainPageUI {
    let JSONConfig: any;
    let server: NetServerMain;
    export function MainPageSet(): void {
        JSONConfig = JSON.parse(String(fs.readFileSync('ACCSSConfig.json')));
        console.log(JSONConfig.nodeServerIP);
        server = new NetServerMain(JSONConfig.nodeServerPort, JSONConfig.nodeServerIP);
        ReactDOM.render(
            <>
                <MainPageUI />
            </>,
            document.getElementById("root")
        )
    }

    class MainPageUI extends React.Component {
        public render() {
            return (
                <>
                    <Barmenu />
                    <FootTitle />
                </>
            );
        }
    }

    interface BarmenuProps {

    }

    interface BarmenuState {
        RenaderID: number;
    }

    class Barmenu extends React.Component<BarmenuProps, BarmenuState> {
        RenderElement: JSX.Element;
        constructor(props) {
            super(props);
            this.state = { RenaderID: 0 };
            this.FlyingMonitorRender = this.FlyingMonitorRender.bind(this);
            this.DroneStatusRender = this.DroneStatusRender.bind(this);
            this.DroneSettingsRender = this.DroneSettingsRender.bind(this);
            this.AdvanceSettingRender = this.AdvanceSettingRender.bind(this);
        }

        private FlyingMonitorRender(): void {
            if (this.state.RenaderID != 0) {
                this.setState({ RenaderID: 0 })
            }
        }

        private DroneStatusRender(): void {
            if (this.state.RenaderID != 1) {
                this.setState({ RenaderID: 1 })
            }
        }

        private DroneSettingsRender(): void {
            if (this.state.RenaderID != 2) {
                this.setState({ RenaderID: 2 })
            }
        }

        private AdvanceSettingRender(): void {
            if (this.state.RenaderID != 3) {
                this.setState({ RenaderID: 3 })
            }
        }

        public render() {
            if (this.state.RenaderID == 0) {
                this.RenderElement = <FlyingMonitorComponent />;
            } else if (this.state.RenaderID == 1) {
                this.RenderElement = <DroneStatusComponent />;
            } else if (this.state.RenaderID == 2) {
                this.RenderElement = <DroneSettingsComponent />
            } else if (this.state.RenaderID == 3) {

            }

            return (
                <>
                    <div className="BarmenuShot">
                        <div id="Barmenu">
                            <ul>
                                <li>
                                    <a href="#" onClick={this.FlyingMonitorRender}>
                                        <i className="fa fa-rocket"></i>
                                        <span id="FlyingMonitor">FlyingMonitor</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.DroneStatusRender}>
                                        <i className="fa fa-television"></i>
                                        <span id="DroneStatus">DroneStatus</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.DroneSettingsRender}>
                                        <i className="fa fa-cog"></i>
                                        <span id="DroneSettings">DroneSettings</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" onClick={this.AdvanceSettingRender}>
                                        <i className="fa fa-sliders"></i>
                                        <span id="AdvanceSetting">AdvanceSetting</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div id="MainPageArea">{this.RenderElement}</div>
                </>
            )
        }
    }

    interface footTitleProps {

    }

    interface footTileState {
        DeviceCount: number;
        deviceListIsShow: boolean;
    }

    class FootTitle extends React.Component<footTitleProps, footTileState> {
        timerID: NodeJS.Timeout;
        deviceList: Array<number>;
        deviceListElement: Array<JSX.Element> = new Array<JSX.Element>();
        constructor(props) {
            super(props);
            this.state = { DeviceCount: 0, deviceListIsShow: false }
            this.showDeviceList = this.showDeviceList.bind(this);
        }

        componentDidMount() {
            this.timerID = setInterval(() => {
                this.setState({ DeviceCount: server.getUseableID().length });
                this.deviceListElement = Array<JSX.Element>();
                this.deviceList = server.getUseableID();
                for (let index = 0; index < this.deviceList.length; index++) {
                    this.deviceListElement.push(
                        <li key={index.toString()}>
                            <a href="#">
                                <div id="deviceId">DeviceID:  {this.deviceList[index]}<br />
                                    <div id="deviceType">[Unkown]</div>
                                    <i className="fa fa-battery-half" aria-hidden="true"></i>
                                </div>
                            </a>
                        </li>
                    );
                }
            }, 1000)
        }

        showDeviceList() {
            if (this.state.deviceListIsShow) {
                this.setState({ deviceListIsShow: false })
            } else if (!this.state.deviceListIsShow) {
                this.setState({ deviceListIsShow: true })
            }
        }

        public render() {
            return (
                <>
                    <div id="footBar">
                        <div className="deviceListShot" style={{ height: this.state.deviceListIsShow ? "400px" : "0" }}>
                            <div id="deviceList">
                                <div id="deviceListHeader">
                                    <i className="fa fa-search" aria-hidden="true"></i>
                                    <input type="text" placeholder="Search"></input>
                                    <a href="#"><i className="fa fa-plus-square" aria-hidden="true"></i></a>
                                </div>
                                <ul>
                                    <div id="deviceListNone">Current not have any device</div>
                                    {this.deviceListElement}
                                </ul>
                            </div>
                        </div>
                        <a href="#" id="footName"> ACCSS by TSKangetsu </a>
                        <a href="#" id="footVersion"> Version  0.0.1-Beta </a>
                        <a href="#" onClick={this.showDeviceList} id="footDevice">Connected Device:{this.state.DeviceCount}</a>
                    </div>
                </>
            )
        }
    }

    //=================================================================================================================================//

    class FlyingMonitorComponent extends React.Component {
        public render() {
            return (
                <>
                    <Map />
                    <GLRTShow />
                </>
            );
        }
    }

    class DroneStatusComponent extends React.Component {
        public render() {
            return (
                <>
                    <SensorRTChart />
                    <CVShowArea />
                </>
            );
        }
    }

    class DroneSettingsComponent extends React.Component {
        public render() {
            return (
                <>
                    <div id="controllertypepanel"></div>
                </>
            )
        }
    }

    //=================================================================================================================================//

    class Map extends React.Component {
        //height为不安定要素，bug难以复现，须注意
        MainMap: MapShow;

        private MapMainCSS: React.CSSProperties = {
            position: "absolute",
            height: "-webkit-calc(100% - 6px)",
            width: "-webkit-calc(100% - 380px)",
            right: "0px",
            border: "3px solid black"
        };

        private MapCSS: React.CSSProperties = {
            height: "-webkit-calc(100% - 20px)",
            width: "-webkit-calc(100% - 45px)",
            top: "0",
            left: "0"
        };

        private MapRightCSS: React.CSSProperties = {
            position: "absolute",
            width: "45px",
            height: "-webkit-calc(100% - 20px)",
            backgroundColor: "black",
            right: "0",
            top: "0",
            zIndex: -1,
        }

        private MapBottomCSS: React.CSSProperties = {
            width: "100%",
            height: "20px",
            bottom: "0px",
            backgroundColor: "black",
        }

        public render() {
            return (
                <>
                    <div id="MapArea" style={this.MapMainCSS}>
                        <div id="Map" style={this.MapCSS}></div><div id="MapRight" style={this.MapRightCSS}></div>
                        <div id="MapBottom" style={this.MapBottomCSS}></div>
                    </div>
                </>
            )
        }

        componentDidMount() {
            this.MainMap = new MapShow("Map");
        }
    }

    class SensorRTChart extends React.Component {
        private GryoYaw: number;
        private GryoRoll: number;
        private GryoPitch: number;
        private TimerID: NodeJS.Timeout;
        private Gryochart: EchartShowSys;
        private SensorRTChartCSS: React.CSSProperties = {
            backgroundColor: "rgb(253, 253, 253)",
            top: "43px",
            height: "250px",
            width: "50%"
        };

        public render() {
            return (
                <>
                    <div id='SensorRTChart' style={this.SensorRTChartCSS}></div>
                </>
            );
        }

        componentDidMount() {
            this.SensorRTChartInit();
            window.onresize = () => this.Gryochart.EchartAreaUpdate();
            this.TimerID = setInterval(() => {
                this.Gryochart.EchartsDataAdd(Number(server.deviceRTDataBuffer[1][2]), this.GryoPitch);
                this.Gryochart.EchartsDataAdd(Number(server.deviceRTDataBuffer[1][3]), this.GryoRoll);
                this.Gryochart.EchartsDataAdd(Number(server.deviceRTDataBuffer[1][4]), this.GryoYaw);
            }, 100);
        }

        componentWillUnmount() {
            window.onresize = null;
            clearInterval(this.TimerID);
        }

        private SensorRTChartInit() {
            this.Gryochart = new EchartShowSys(document.getElementById('SensorRTChart'), "Gryo", { ymax: 550, ymin: -550 });
            this.GryoPitch = this.Gryochart.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(30)
            })
            this.GryoRoll = this.Gryochart.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(30)
            })
            this.GryoYaw = this.Gryochart.EhcartSeriesAdd({
                name: 'Charts',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: new Array(30)
            })
        }
    }

    class CVShowArea extends React.Component {
        serverProcess: ps.ChildProcess;

        public render() {
            this.MJPEGServerINIT();
            return (
                <>
                    <img id="myImage" src={JSONConfig.renderMJPEGServerSRC}></img>
                </>
            );
        }

        MJPEGServerINIT() {
            this.serverProcess = ps.exec(JSONConfig.renderMJPEGServerBinWin + " -f='192.168.137.240' -fp=10086 ", (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }

        componentWillUnmount() {
            //windows Only
            ps.spawn("taskkill", ["/F", "/IM", "ACCSSVideoServer.exe"]);
            document.getElementById("myImage").setAttribute("src", "");
        }
    }

    class GLRTShow extends React.Component {
        private GLRTMainCSS: React.CSSProperties = {
            position: "absolute",
            minWidth: "350px",
            width: "350px",
            height: "260px",
            top: "0",
            left: "0"
        }

        public render() {
            return (
                <>
                    <div id="GLRT" style={this.GLRTMainCSS}></div>
                </>
            );
        }
    }
}