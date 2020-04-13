// src/controllers/ui/widgetLibraryWrapper.ts

import {PluginIdLibraryMap} from "../../constants";

const DefaultPluginId = 'material-widgets';

export function getWidget(name: string, props: any) {
    let tempList = name.split('::');
    if (tempList.length === 1) tempList = [DefaultPluginId, ...tempList];
    const widgetName = tempList[1];
    const pluginId = tempList[0];
    const libraryName = PluginIdLibraryMap[pluginId];
    const library: any = window[libraryName]
    const getWidgetFunc = library['getWidget'];
    return getWidgetFunc(widgetName, props);
}

export function getWidgetConfiguration(name: string) {
    let tempList = name.split('::');
    if (tempList.length === 1) tempList = [DefaultPluginId, ...tempList];
    const widgetName = tempList[1];
    const pluginId = tempList[0];
    const libraryName = PluginIdLibraryMap[pluginId];
    const library: any = window[libraryName]
    const getWidgetConfigurationFunc = library['getWidgetConfiguration'];
    return getWidgetConfigurationFunc(widgetName);
}

export function getWidgetInfo(pluginId: string) {
    const libraryName = PluginIdLibraryMap[pluginId];
    const library: any = window[libraryName]
    return library['widgetInfo'];
}
