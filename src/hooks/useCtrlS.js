import { useEffect, useRef } from "react";

function useCtrlS(cb) {
    const callback = useRef(cb);

    useEffect(() => {
        callback.current = cb;
    });

    useEffect(() => {
        function handle(event) {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            const isSaveShortcut =
                (isMac && event.metaKey && event.key.toLowerCase() === "s") ||
                (!isMac && event.ctrlKey && event.key.toLowerCase() === "s");

            if (isSaveShortcut) {
                event.preventDefault(); // Prevent default Ctrl+S action
                callback.current(event);
            }
        }

        document.addEventListener("keydown", handle);
        return () => document.removeEventListener("keydown", handle);
    }, []);
}

export default useCtrlS;
