import React from "react";

export default function BasicModalContent(props: any) {
  return (
    <div className={`basic-modal ${props.className ? props.className : ''}`}>
      {props.customTitle && (
        <div className="basic-modal__title">
          {props.customTitle}
        </div>
      )}
      <div className="basic-modal__content">
        {props.content}
      </div>
      {!props.noPanel && (
        <div className={`basic-modal__panel`}>
          <div className="btn" onClick={props.close}>Cancel</div>

          {!!props.onSubmit && (
            <div className="btn btn--gradient ml-4" onClick={props.onSubmit}>
              {props.submitText ?? 'Confirm'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}