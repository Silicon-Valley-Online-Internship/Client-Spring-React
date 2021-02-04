import React, { Fragment } from 'react';
import './HomeView.css';
import Slider from "react-slick";
import img_preview from "../assets/img/previewimg.jpg";
import Pill_img from "../assets/img/pills_example01.jpg";
import UploadService from "../service/upload-files.service";

class AllView extends React.Component {
    constructor(props) {
        super(props);
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);


        this.state = {
            selectedFiles: undefined,
            currentFile: undefined,
            progress: 0,
            message: "",
            loading: false,
            PillInfos: null,
        };
    }
    /*
    InputComponent
    */
    selectFile(event)
    {
        event.preventDefault();
        let reader = new FileReader();
        let file = event.target.files[0];
        reader.onloadend = () => {
            this.setState({
                selectedFiles: event.target.files,
                file : file,
                previewURL : reader.result
            })
        }
        reader.readAsDataURL(file);
    }

    upload()
    {
        let currentFile = this.state.selectedFiles[0];

        this.setState({
            progress: 0,
            currentFile: currentFile,
        });

        UploadService.upload(currentFile, (event) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        }).then((response) => {
            console.log(response)

            this.setState({
                PillInfos: response,
            });

            return UploadService.getFiles();
        }).catch(() => {
            this.setState({
                progress: 0,
                message: "upload the file!",
                currentFile: undefined,
            });
        }).finally(() => {
            this.setState({
                loading:true,
            })
        });

        this.setState({
            selectedFiles: undefined,
        });
    }
/*
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.loading){
       //upload 동시에 다음컴포넌트로 넘어가는 부분 로직! slick에 api호출로 가능한 기능이 있나 봐야할거같음
       안그러면 click버튼 호출이용해서 넘기는 ? 방식 ! 오래걸릴거같음 ..
        }
    }
*/
    /*
    OutputComponent
    */
    componentDidMount() {
        UploadService.getFiles().then((response) => {
            this.setState({
                PillInfos : response.data,
            });
        });
    }

    translation(){

    }


    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        /*
        InputComponent
        */
        const {
            selectedFiles,
            currentFile,
            progress,
        } = this.state;

        let profile_preview = null;
        if(this.state.file !== ''){
            if(typeof this.state.file !== 'undefined') {
                profile_preview = <img className='profile_preview' src={this.state.previewURL}></img>;
            }
            else {
                profile_preview = <img className='profile_preview' src={img_preview}></img>;
            }
        }

        /*
        OutputComponent
        */


        return (
            <div className="cover-container d-flex h-100 p-3 mx-auto flex-column text-center">
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta name="description" content />
                <meta name="author" content />
                <link rel="icon" href="/docs/4.0/assets/img/favicons/favicon.ico" />
                <title>Cover Template for Bootstrap</title>
                <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/cover/" />
                {/* Bootstrap core CSS */}
                <link href="../../dist/css/bootstrap.min.css" rel="stylesheet" />
                {/* Custom styles for this template */}
                <link href="cover.css" rel="stylesheet" />
                <header className="masthead mb-auto">
                    <div className="inner">
                        <h3 className="masthead-brand">Pill Good</h3>
                        <nav className="nav nav-masthead justify-content-center">
                            <a className="nav-link active" href="#">Home</a>
                            <a className="nav-link" href="#">Features</a>
                            <a className="nav-link" href="#">Contact</a>
                        </nav>
                    </div>
                </header>
                <main role="main" className="inner cover">
                    <div style={{margin:10}}>
                        <h1 className="cover-heading">Search for <b>pills</b> easily through pictures</h1>
                        <p>Medetector analyzes the formulation, shape, and identification of the pill <br/>and tells you what kind of medicine it is. <br/>Let's protect our health by keeping and taking the right medication.</p>
                    </div>
                    <div>
                        <Slider {...settings}>
                            <div>
                                {/*InputComponent start*/}

                                <div>
                                    {currentFile && (
                                        <div className="progress">
                                            <div
                                                className="progress-bar progress-bar-info progress-bar-striped"
                                                role="progressbar"
                                                aria-valuenow={progress}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                                style={{ width: progress + "%" }}
                                            >
                                                {progress}%
                                            </div>
                                        </div>
                                    )}

                                    <div className="filebox bs3-warning">
                                        <label style = {{margin:0, marginRight:10}} htmlFor="ex_file2">Find your photo</label>
                                        <input type="file" id="ex_file2"
                                               accept='image/jpg'
                                               name='profile_img'
                                               onChange={this.selectFile} />

                                        {/*업로드 버튼*/}
                                        <button style={{marginLeft:10}} className="btn btn-dark active"
                                                disabled={!selectedFiles}
                                                onClick={this.upload}
                                        >
                                            Upload
                                        </button>
                                    </div>
                                    {profile_preview}

                                </div>
                                {/*InputComponent end*/}
                            </div>
                            <div>
                                {/*OutputComponent start*/}
                                <div>

                                    <div>
                                        <img src={this.state.PillInfos?.url} alt="pill"/>
                                    </div>

                                    <div>

                                        <h1 className = "text-center"> {this.state.PillInfos?.name}.</h1>
                                        <table className = "table table-striped" style={{color:"white"}} >

                                            <thead>
                                            <tr>

                                                <td> 제조회사 </td>
                                                <td> 각인 </td>

                                            </tr>

                                            </thead>
                                            {!this.state.loading ?
                                                (
                                                    null
                                                ) :
                                                (
                                                    <tbody>
                                                    {
                                                       this.state.PillInfos &&
                                                            <tr>
                                                                <td>{this.state.PillInfos.company}</td>
                                                                <td>{this.state.PillInfos.engrave}</td>
                                                            </tr>

                                                    }
                                                    </tbody>
                                                )}
                                        </table>
                                        <table className = "table table-striped" style={{color:"white"}} >
                                            <thead>
                                            <tr>

                                                <td> 효능 </td>
                                                <td> 부작용</td>

                                            </tr>

                                            </thead>
                                            {!this.state.loading ?
                                                (
                                                    null
                                                ) :
                                                (
                                                    <tbody>
                                                    {
                                                        this.state.PillInfos &&
                                                        <tr>
                                                                <td>{this.state.PillInfos.effect}</td>
                                                                <td>{this.state.PillInfos.sideeffect}</td>
                                                            </tr>

                                                    }
                                                    </tbody>
                                                )}
                                        </table>
                                    </div>
                                </div>
                                {/*OutputComponent end*/}
                            </div>
                        </Slider>
                    </div>
                </main>
                <footer className="mastfoot mt-auto">
                    <div className="inner">
                        <p><br/>Source Code for <a href="https://github.com/Silicon-Valley-Online-Internship/">Github</a><br/>made by YoungSeok-Choi, SeoHyeon-Ryu, SeongJin-Ahn and Chan-Park.</p>
                    </div>
                </footer>
            </div>
        )
    };
}

export default AllView;