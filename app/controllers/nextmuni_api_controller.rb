require 'nokogiri'
require 'open-uri'

NEXTMUNI_API_BASE = 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&';
class NextmuniApiController < ApplicationController
  def get
    url = "#{NEXTMUNI_API_BASE + params[:route]}"
    predictions = Nokogiri::HTML(open(url)).css('prediction').map do |prediction|
      seconds_to_display(prediction.attr('seconds').to_i)
    end
    render :json => predictions, :template => nil
  end

private

  def seconds_to_display(seconds)
    minutes = seconds / 60
    seconds = seconds % 60
    "#{minutes} min and #{seconds} seconds"
  end

end
