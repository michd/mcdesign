require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter: "mysql2",
  host: "localhost",
  username: ENV["MCDESIGN_MYSQL_USER"],
  password: ENV["MCDESIGN_MYSQL_PWD"],
  database: ENV["MCDESIGN_MYSQL_DB"]
)

class MCDesign < ActiveRecord::Base
  def self.from_hash(data)
    MCDesign.new(
      id: MCDesign.generate_id,
      width: data["w"],
      height: data["h"],
      design: data["m"].to_json,
      timestamp: Time.now.to_i
    )
  end

private
  def self.generate_id
    base_id = (Time.now.to_f.to_s[0, 13].to_f * 100).to_i

    encoding = ('0'..'9').to_a + ('a'..'z').to_a

   s = ''

   while base_id > 0
     s << encoding[base_id.modulo(36)]
     base_id /= 36
   end

   s.reverse
  end

end
