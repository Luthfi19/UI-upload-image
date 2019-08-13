import React, { Component } from 'react';
import { CustomInput } from 'reactstrap';
import axios from 'axios';
import {API_URL} from '../helpers'

class ManagePosts extends Component {
    state = { listPosts: [], addImageFileName: 'Select Image...', addImageFile: undefined, captionAdd: '' }

    componentDidMount(){
        axios.get(`${API_URL}/post/getposts`)
        .then((res) => {
            this.setState({listPosts: res.data})
        }).catch((err) => {
            console.log(err)
        })
    }

    onAddImageFileChange = (e) => {
        // console.log(document.getElementById('addImagePost').files[0])
        // console.log(e.target.files[0])
        if(e.target.files[0]) {
            this.setState({ addImageFileName: e.target.files[0].name, addImageFile: e.target.files[0]})
        }
        else {
            this.setState({ addImageFileName: 'Select Image...', addImageFile: undefined })
        }
    }

    onCaptionAddChange = (e) => {
        // console.log(e.target.value)
        if(e.target.value.length <= 100) {
            this.setState({ captionAdd: e.target.value })
        }
    }

    onBtnAddPostClick = () => {
        if(this.state.addImageFile) {
            var formData = new FormData()
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var data = {
                caption: this.state.captionAdd,
                userId: 1
            }

            formData.append('image', this.state.addImageFile)
            formData.append('data', JSON.stringify(data))

            axios.post( API_URL + "/post/addpost", formData, headers)
            .then((res) => {
                this.setState({listPosts: res.data})
            })
            .catch((err) =>{
                console.log(err)
            })
        }
        else {
            alert('Image harus diisi!')
        }
    }

    onBtnEditClick = (id) => {

    }

    onBtnDeleteCLick = (id) => {
        axios.delete(`${API_URL}/post/deletepost/${id}`)
        .then((res) => {
           
            this.setState({listPosts : res.data})
        }).catch((err) => {
            console.log(err)
        })
    }

    renderListPosts = () => {
        return this.state.listPosts.map((item) => {
           
                return (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td><img src={`${API_URL}${item.image}`} alt={`${item.image}`} width={100}/></td>
                        <td>{item.caption}</td>
                        <td>{item.userId}</td>
                        <td><input className="btn btn-primary" type="button" value ="Edit" onClick={() => this.onBtnEditClick(item.id)}/></td>
                        <td><input className="btn btn-danger" type="button" value ="Delete" onClick={() => this.onBtnDeleteCLick(item.id)}/></td>
                    </tr>
                )
            
        })
    }

    render() {
        return (
            <div>
                <center>
                    <h1>Manage Posts</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Caption</th>
                                <th>User Id</th>
                                <th />
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderListPosts()}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td />
                                <td>
                                    <CustomInput id="addImagePost" type="file" label={this.state.addImageFileName} onChange={this.onAddImageFileChange} />
                                </td>
                                <td>
                                    <textarea value={this.state.captionAdd} onChange={this.onCaptionAddChange}>
                                    </textarea>
                                </td>
                                <td />
                                <td><input type="button" className="btn btn-success" value="Add" onClick={this.onBtnAddPostClick}/></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </center>
            </div>
        )
    }
}

export default ManagePosts;