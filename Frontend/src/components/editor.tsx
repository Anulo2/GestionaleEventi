import React from "react";

import "react-quill/dist/quill.snow.css";

import ReactQuill, { Quill } from "react-quill";
import ResizeModule from "@ssumo/quill-resize-module";
Quill.register("modules/resize", ResizeModule);
import { useState } from "react";

function Editor({ onChange, value, placeholder, readOnly = false }) {
	return (
		<ReactQuill
			value={value}
			onChange={onChange}
			theme="snow"
			placeholder={placeholder}
			readOnly={readOnly}
			modules={
				readOnly
					? {
							toolbar: false,
					  }
					: {
							toolbar: [
								[
									{
										header: [1, 2, 3, 4, 5, 6, false],
									},
								],
								["bold", "italic", "underline"],
								["link", "blockquote", "code-block", "image"],
								[{ list: "ordered" }, { list: "bullet" }],
								[{ align: [] }, { indent: "-1" }, { indent: "+1" }],
								["clean"],
							],
							resize: {
								locale: {
									altTip: "Hold down the alt key to resize proportionally",
									inputTip: "Press Enter to confirm",
									floatLeft: "Left",
									floatRight: "Right",
									center: "Center",
									restore: "Restore",
								},
							},
					  }
			}
		/>
	);
}

export default Editor;