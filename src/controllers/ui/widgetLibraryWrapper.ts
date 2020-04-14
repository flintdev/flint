// src/controllers/ui/widgetLibraryWrapper.ts

export function getWidget(name: string, props: any) {
    const tempList: any = name.split('::');
    const widgetName = tempList[1];
    const pluginId = tempList[0];
    const library: any = window[pluginId]
    const getWidgetFunc = library['getWidget'];
    return getWidgetFunc(widgetName, props);
}

export function getWidgetConfiguration(name: string) {
    const tempList: any = name.split('::');
    const widgetName = tempList[1];
    const pluginId = tempList[0];
    const library: any = window[pluginId]
    const getWidgetConfigurationFunc = library['getWidgetConfiguration'];
    return getWidgetConfigurationFunc(widgetName);
}

export function getWidgetInfo(pluginId: string) {
    const libraryName: any = pluginId;
    const library: any = window[libraryName]
    return library['widgetInfo'];
}
