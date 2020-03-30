require 'rubygems'
require 'sinatra'
require 'active_record'
require './mcdesign.rb'


get "/" do
  erb :index
end

get "/:id/?" do
  design = MCDesign.find_by_id params[:id] rescue nil
  return erb :not_found, locals: { id: params[:id] } if design.nil?

  json_hash = {
    w: design.width,
    h: design.height,
    m: JSON.parse(design.design)
  }

  erb :index, locals: { design_json: json_hash.to_json }
end

post "/" do
  raw_design = params[:design]
  design_hash = JSON.parse(raw_design)
  design = MCDesign.from_hash(design_hash)
  design.save!

  # Nothing will go wrong ever, don't worry.
  output_hash = {
    status: 'success',
    designID: design.id
  };

  return output_hash.to_json
end

