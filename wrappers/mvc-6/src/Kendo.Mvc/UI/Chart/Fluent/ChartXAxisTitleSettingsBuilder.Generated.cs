using System;
using System.Collections.Generic;
using Kendo.Mvc.Extensions;

namespace Kendo.Mvc.UI.Fluent
{
    /// <summary>
    /// Defines the fluent API for configuring ChartXAxisTitleSettings
    /// </summary>
    public partial class ChartXAxisTitleSettingsBuilder<T>
        where T : class 
    {
        /// <summary>
        /// The background color of the title. Accepts a valid CSS color string, including hex and rgb.
        /// </summary>
        /// <param name="value">The value for Background</param>
        public ChartXAxisTitleSettingsBuilder<T> Background(string value)
        {
            Container.Background = value;
            return this;
        }

        /// <summary>
        /// The border of the title.
        /// </summary>
        /// <param name="configurator">The configurator for the border setting.</param>
        public ChartXAxisTitleSettingsBuilder<T> Border(Action<ChartXAxisTitleBorderSettingsBuilder<T>> configurator)
        {

            Container.Border.Chart = Container.Chart;
            configurator(new ChartXAxisTitleBorderSettingsBuilder<T>(Container.Border));

            return this;
        }

        /// <summary>
        /// The text color of the title. Accepts a valid CSS color string, including hex and rgb.
        /// </summary>
        /// <param name="value">The value for Color</param>
        public ChartXAxisTitleSettingsBuilder<T> Color(string value)
        {
            Container.Color = value;
            return this;
        }

        /// <summary>
        /// The font style of the title.
        /// </summary>
        /// <param name="value">The value for Font</param>
        public ChartXAxisTitleSettingsBuilder<T> Font(string value)
        {
            Container.Font = value;
            return this;
        }

        /// <summary>
        /// The margin of the title. A numeric value will set all margins.
        /// </summary>
        /// <param name="configurator">The configurator for the margin setting.</param>
        public ChartXAxisTitleSettingsBuilder<T> Margin(Action<ChartXAxisTitleMarginSettingsBuilder<T>> configurator)
        {

            Container.Margin.Chart = Container.Chart;
            configurator(new ChartXAxisTitleMarginSettingsBuilder<T>(Container.Margin));

            return this;
        }

        /// <summary>
        /// The padding of the title. A numeric value will set all paddings.
        /// </summary>
        /// <param name="configurator">The configurator for the padding setting.</param>
        public ChartXAxisTitleSettingsBuilder<T> Padding(Action<ChartXAxisTitlePaddingSettingsBuilder<T>> configurator)
        {

            Container.Padding.Chart = Container.Chart;
            configurator(new ChartXAxisTitlePaddingSettingsBuilder<T>(Container.Padding));

            return this;
        }

        /// <summary>
        /// The rotation angle of the title. By default the title is not rotated.
        /// </summary>
        /// <param name="value">The value for Rotation</param>
        public ChartXAxisTitleSettingsBuilder<T> Rotation(double value)
        {
            Container.Rotation = value;
            return this;
        }

        /// <summary>
        /// The text of the title.
        /// </summary>
        /// <param name="value">The value for Text</param>
        public ChartXAxisTitleSettingsBuilder<T> Text(string value)
        {
            Container.Text = value;
            return this;
        }

        /// <summary>
        /// If set to true the chart will display the scatter chart x axis title. By default the scatter chart x axis title is visible.
        /// </summary>
        /// <param name="value">The value for Visible</param>
        public ChartXAxisTitleSettingsBuilder<T> Visible(bool value)
        {
            Container.Visible = value;
            return this;
        }

        /// <summary>
        /// A function that can be used to create a custom visual for the title. The available argument fields are: text - the label text.; rect - the kendo.geometry.Rect that defines where the visual should be rendered.; sender - the chart instance (may be undefined).; options - the label options. or createVisual - a function that can be used to get the default visual..
        /// </summary>
        /// <param name="handler">The name of the JavaScript function that will be evaluated.</param>
        public ChartXAxisTitleSettingsBuilder<T> Visual(string handler)
        {
            Container.Visual = new ClientHandlerDescriptor { HandlerName = handler };
            return this;
        }

        /// <summary>
        /// A function that can be used to create a custom visual for the title. The available argument fields are: text - the label text.; rect - the kendo.geometry.Rect that defines where the visual should be rendered.; sender - the chart instance (may be undefined).; options - the label options. or createVisual - a function that can be used to get the default visual..
        /// </summary>
        /// <param name="handler">The handler code wrapped in a text tag.</param>
        public ChartXAxisTitleSettingsBuilder<T> Visual(Func<object, object> handler)
        {
            Container.Visual = new ClientHandlerDescriptor { TemplateDelegate = handler };
            return this;
        }
        /// <summary>
        /// Specifies the title position.
        /// </summary>
        /// <param name="value">The value for Position</param>
        public ChartXAxisTitleSettingsBuilder<T> Position(ChartAxisTitlePosition value)
        {
            Container.Position = value;
            return this;
        }

    }
}
