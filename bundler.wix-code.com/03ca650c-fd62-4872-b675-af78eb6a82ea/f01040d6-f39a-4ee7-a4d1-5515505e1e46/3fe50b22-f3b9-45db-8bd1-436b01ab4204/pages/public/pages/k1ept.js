import wixWindowFrontend from 'wix-window-frontend';
$w.onReady(function () {
    const defaultButtonLabel = $w('#copy').label
    $w('#copy').onClick(() => {
        wixWindowFrontend.copyToClipboard($widget.props.content)
            .then(() => {
                $w('#copy').label = $widget.props.buttonLabelCopied
                setTimeout(() => {
                    $w('#copy').label = defaultButtonLabel
                }, $widget.props.timeout)
            })
            .catch(() => {
                $w('#copy').label = $widget.props.buttonLabelError
                setTimeout(() => {
                    $w('#copy').label = defaultButtonLabel
                }, $widget.props.timeout)
            })
    })
});