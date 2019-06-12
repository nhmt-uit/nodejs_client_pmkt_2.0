import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';

import { AppConfig } from 'my-constants';



class TinyMCE extends Component {
	// handleEditorChange = (e) => {
	// 	this.props.onChange(e.target.getContent());
	// }
	
  	render() {
		const { onChange, content } = this.props;
		
    	return (
      		<Editor
				// apiKey="uqulut3tdqs4596vhh0ne1etlut7lo75zcqwinu01z5f7k7k"
				// initialValue={content}
				value={content}
				init={{
					theme: "modern",
					plugins: [
						'advlist autolink lists link image charmap print preview anchor',
						'searchreplace visualblocks advcode fullscreen',
						'insertdatetime media table contextmenu powerpaste imagetools wordcount responsivefilemanager'
					],
					// toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
					toolbar: 'insertfile undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image code responsivefilemanager ',
					image_advtab: true,
					powerpaste_allow_local_images: true,
					powerpaste_word_import: 'prompt',
					powerpaste_html_import: 'prompt',
					content_css: [
						'//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
						'//www.tinymce.com/css/codepen.min.css'],
					height: 250,

					relative_urls: false,
					external_filemanager_path: `${AppConfig.API_SERVER}/plugin/tinymce/filemanager/`,
					filemanager_title:"Responsive Filemanager" ,
					external_plugins: { "filemanager" :  `${AppConfig.API_SERVER}/plugin/tinymce/filemanager/plugin.min.js`},
					filemanager_crossdomain: true,

					mobile: {
						theme: 'mobile',
						plugins: [ 'autosave', 'lists', 'autolink' ],
						height: 150
					}
				}}
				// onChange={this.handleEditorChange}
				onEditorChange={onChange}
      		/>
    	)
  	}
}

export default TinyMCE;