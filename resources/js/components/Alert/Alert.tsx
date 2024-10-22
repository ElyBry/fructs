import * as React from "react";
import styles from "../../../sass/_alert.module.scss";

const Alert = ({message}) => {


    if (message != '') {
        return (
            <div className={styles.alert}>
                {message}
            </div>
        )
    }
}

export default Alert;
